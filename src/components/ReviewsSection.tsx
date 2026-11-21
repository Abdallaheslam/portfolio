import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore';
import { CheckCircle2, MessageSquareQuote, Send, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getPortfolioContent } from '../data/portfolioData';
import {
  db,
  handleFirestoreError,
  OperationType,
  testFirestoreConnection,
} from '../lib/firebase';
import { syncSeoMetadata } from '../utils/seo';
import { trackEvent } from '../utils/analytics';

interface VisitorReviewItem {
  id: string;
  authorName: string;
  comment: string;
  rating: number;
  createdAtMs: number | null;
}

const REVIEWS_COLLECTION = 'visitorReviews';
const MIN_NAME_LEN = 2;
const MAX_NAME_LEN = 60;
const MIN_COMMENT_LEN = 5;
const MAX_COMMENT_LEN = 600;

export default function ReviewsSection() {
  const { lang } = useLanguage();
  const { reviewsSection } = getPortfolioContent(lang);

  const [reviews, setReviews] = useState<VisitorReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    rating?: string;
    comment?: string;
  }>({});

  useEffect(() => {
    void testFirestoreConnection();

    const reviewsQuery = query(
      collection(db, REVIEWS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(50),
    );

    const unsubscribe = onSnapshot(
      reviewsQuery,
      (snapshot) => {
        const next: VisitorReviewItem[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          const ts = data.createdAt as Timestamp | undefined;
          const rawRating = typeof data.rating === 'number' ? data.rating : 5;
          return {
            id: docSnap.id,
            authorName: typeof data.authorName === 'string' ? data.authorName : 'Visitor',
            comment: typeof data.comment === 'string' ? data.comment : '',
            rating: Math.min(5, Math.max(1, Math.round(rawRating))),
            createdAtMs: ts && typeof ts.toMillis === 'function' ? ts.toMillis() : null,
          };
        });
        setReviews(next);
        setLoading(false);
        setLoadError(false);
      },
      (error) => {
        setLoading(false);
        setLoadError(true);
        try {
          handleFirestoreError(error, OperationType.LIST, REVIEWS_COLLECTION);
        } catch {
          // Structured error logged via handleFirestoreError
        }
      },
    );

    return () => unsubscribe();
  }, []);

  const stats = useMemo(() => {
    const count = reviews.length;
    if (count === 0) {
      return {
        count: 0,
        average: 0,
        distribution: [5, 4, 3, 2, 1].map((stars) => ({ stars, count: 0, pct: 0 })),
      };
    }

    const total = reviews.reduce((acc, item) => acc + item.rating, 0);
    const average = total / count;
    const distribution = [5, 4, 3, 2, 1].map((stars) => {
      const matches = reviews.filter((r) => r.rating === stars).length;
      return {
        stars,
        count: matches,
        pct: Math.round((matches / count) * 100),
      };
    });

    return { count, average, distribution };
  }, [reviews]);

  useEffect(() => {
    if (stats.count > 0) {
      syncSeoMetadata(lang, {
        ratingCount: stats.count,
        ratingValue: stats.average,
        recentReviews: reviews.slice(0, 5).map((r) => ({
          author: r.authorName,
          rating: r.rating,
          comment: r.comment,
          datePublished: r.createdAtMs ? new Date(r.createdAtMs).toISOString() : undefined,
        })),
      });
    } else {
      syncSeoMetadata(lang);
    }
  }, [lang, reviews, stats.average, stats.count]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitSuccess(false);
    setSubmitError(null);

    const trimmedName = authorName.trim();
    const trimmedComment = comment.trim();
    const cleanRating = Math.trunc(rating);

    const nextErrors: { name?: string; rating?: string; comment?: string } = {};
    if (trimmedName.length < MIN_NAME_LEN || trimmedName.length > MAX_NAME_LEN) {
      nextErrors.name = reviewsSection.validation.name;
    }
    if (cleanRating < 1 || cleanRating > 5) {
      nextErrors.rating = reviewsSection.validation.rating;
    }
    if (trimmedComment.length < MIN_COMMENT_LEN || trimmedComment.length > MAX_COMMENT_LEN) {
      nextErrors.comment = reviewsSection.validation.comment;
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});
    setSubmitting(true);

    try {
      await addDoc(collection(db, REVIEWS_COLLECTION), {
        authorName: trimmedName.slice(0, MAX_NAME_LEN),
        comment: trimmedComment.slice(0, MAX_COMMENT_LEN),
        rating: cleanRating,
        createdAt: serverTimestamp(),
      });

      setAuthorName('');
      setComment('');
      setRating(5);
      setSubmitSuccess(true);
      trackEvent('Visitor Review Submitted', {
        section: 'reviews',
        label: `${cleanRating}_stars`,
      });
    } catch (error) {
      setSubmitError(reviewsSection.errorMessage);
      try {
        handleFirestoreError(error, OperationType.CREATE, REVIEWS_COLLECTION);
      } catch {
        // Structured error logged via handleFirestoreError
      }
    } finally {
      setSubmitting(false);
    }
  };

  const activeStarValue = hoverRating ?? rating;
  const ratingHint =
    reviewsSection.ratingHints[Math.min(4, Math.max(0, activeStarValue - 1))] ?? '';

  const formatDate = (ms: number | null) => {
    if (!ms) return '';
    return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(ms));
  };

  return (
    <section id="reviews" className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-medium uppercase tracking-widest text-blue-600 dark:text-blue-400">
            {reviewsSection.kicker}
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {reviewsSection.heading}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
            {reviewsSection.subheading}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left: Anonymous Review Form */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-[#0B1120] p-6 sm:p-7 shadow-xs dark:shadow-none">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-600/10 text-blue-600 dark:text-blue-400">
                  <MessageSquareQuote className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                    {reviewsSection.formTitle}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {reviewsSection.formSubtitle}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
                {/* Author Name */}
                <div>
                  <label
                    htmlFor="review-author-name"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    {reviewsSection.nameLabel}
                  </label>
                  <input
                    id="review-author-name"
                    name="authorName"
                    type="text"
                    maxLength={MAX_NAME_LEN}
                    value={authorName}
                    onChange={(e) => {
                      setAuthorName(e.target.value);
                      if (fieldErrors.name) {
                        setFieldErrors((prev) => ({ ...prev, name: undefined }));
                      }
                    }}
                    placeholder={reviewsSection.namePlaceholder}
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-[#060A13] dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-[#060A13] transition-colors"
                  />
                  {fieldErrors.name && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {fieldErrors.name}
                    </p>
                  )}
                </div>

                {/* Star Rating Picker */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {reviewsSection.ratingLabel}
                    </span>
                    <span className="font-mono text-xs font-semibold text-amber-600 dark:text-amber-400">
                      {activeStarValue}/5 · {ratingHint}
                    </span>
                  </div>

                  <div
                    role="radiogroup"
                    aria-label={reviewsSection.ratingLabel}
                    onMouseLeave={() => setHoverRating(null)}
                    className="mt-2 flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-white/10 dark:bg-[#060A13]"
                  >
                    {[1, 2, 3, 4, 5].map((starValue) => {
                      const active = starValue <= activeStarValue;
                      return (
                        <button
                          key={starValue}
                          type="button"
                          role="radio"
                          aria-checked={rating === starValue}
                          aria-label={
                            lang === 'ar'
                              ? `${starValue} من 5 نجوم`
                              : `${starValue} out of 5 stars`
                          }
                          onMouseEnter={() => setHoverRating(starValue)}
                          onClick={() => {
                            setRating(starValue);
                            if (fieldErrors.rating) {
                              setFieldErrors((prev) => ({ ...prev, rating: undefined }));
                            }
                          }}
                          className="rounded-md p-1.5 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
                        >
                          <Star
                            className={`h-6 w-6 transition-colors ${
                              active
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300 dark:text-slate-600'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  {fieldErrors.rating && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {fieldErrors.rating}
                    </p>
                  )}
                </div>

                {/* Comment */}
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="review-comment"
                      className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                    >
                      {reviewsSection.commentLabel}
                    </label>
                    <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
                      {comment.length}/{MAX_COMMENT_LEN}
                    </span>
                  </div>
                  <textarea
                    id="review-comment"
                    name="comment"
                    rows={4}
                    maxLength={MAX_COMMENT_LEN}
                    value={comment}
                    onChange={(e) => {
                      setComment(e.target.value);
                      if (fieldErrors.comment) {
                        setFieldErrors((prev) => ({ ...prev, comment: undefined }));
                      }
                    }}
                    placeholder={reviewsSection.commentPlaceholder}
                    className="mt-1.5 w-full resize-y rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-[#060A13] dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-[#060A13] transition-colors"
                  />
                  {fieldErrors.comment && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {fieldErrors.comment}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 active:bg-blue-700 disabled:opacity-60 transition-colors cursor-pointer"
                >
                  <Send className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                  <span>
                    {submitting
                      ? reviewsSection.submittingButton
                      : reviewsSection.submitButton}
                  </span>
                </button>

                {submitSuccess && (
                  <div
                    role="status"
                    className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2.5 text-xs font-medium text-emerald-700 dark:text-emerald-300"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{reviewsSection.successMessage}</span>
                  </div>
                )}

                {submitError && (
                  <div
                    role="alert"
                    className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-xs font-medium text-red-700 dark:text-red-300"
                  >
                    {submitError}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Right: Rating Summary + Live Visitor Reviews Feed */}
          <div className="lg:col-span-7 space-y-5">
            {/* Summary Metrics Card */}
            <div className="rounded-2xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-[#0B1120] p-6 shadow-xs dark:shadow-none">
              <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-12">
                <div className="sm:col-span-4 sm:border-e sm:border-slate-200 dark:sm:border-white/[0.08] sm:pe-6">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {reviewsSection.averageLabel}
                  </p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-4xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                      {stats.count > 0 ? stats.average.toFixed(1) : '—'}
                    </span>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      / 5
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1" aria-hidden="true">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={`h-4 w-4 ${
                          stats.count > 0 && n <= Math.round(stats.average)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                    {stats.count > 0
                      ? `${stats.count} ${
                          stats.count === 1
                            ? reviewsSection.totalRatingsSingular
                            : reviewsSection.totalRatingsPlural
                        }`
                      : reviewsSection.noReviewsYet}
                  </p>
                </div>

                {/* Star Distribution Bars */}
                <div className="sm:col-span-8 space-y-2">
                  {stats.distribution.map((row) => (
                    <div key={row.stars} className="flex items-center gap-3 text-xs">
                      <span className="flex w-9 shrink-0 items-center justify-end gap-1 font-mono text-slate-700 dark:text-slate-300 tabular-nums">
                        <span>{row.stars}</span>
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden="true" />
                      </span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.06]">
                        <div
                          className="h-full rounded-full bg-amber-400 transition-all duration-300"
                          style={{ width: `${row.pct}%` }}
                        />
                      </div>
                      <span className="w-8 shrink-0 text-end font-mono text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                        {row.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Reviews List */}
            {loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-[#0B1120] p-8 text-center text-sm text-slate-500 dark:text-slate-400">
                {reviewsSection.loadingMessage}
              </div>
            ) : loadError ? (
              <div className="rounded-2xl border border-red-500/25 bg-red-500/5 p-6 text-sm text-red-700 dark:text-red-300">
                {reviewsSection.errorMessage}
              </div>
            ) : reviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 dark:border-white/[0.1] dark:bg-[#0B1120]/60 p-10 text-center">
                <MessageSquareQuote
                  className="mx-auto h-8 w-8 text-slate-400 dark:text-slate-500"
                  aria-hidden="true"
                />
                <h3 className="mt-3 font-display text-base font-semibold text-slate-900 dark:text-white">
                  {reviewsSection.emptyStateTitle}
                </h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {reviewsSection.emptyStateBody}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => {
                  const initial = review.authorName.trim().charAt(0).toUpperCase() || '?';
                  return (
                    <article
                      key={review.id}
                      className="rounded-2xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-[#0B1120] p-5 sm:p-6 shadow-xs dark:shadow-none"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            aria-hidden="true"
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-500/20 bg-blue-600/10 font-display text-sm font-bold text-blue-600 dark:text-blue-400"
                          >
                            {initial}
                          </div>
                          <div>
                            <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                              {review.authorName}
                            </h3>
                            {review.createdAtMs && (
                              <time
                                dateTime={new Date(review.createdAtMs).toISOString()}
                                className="text-xs text-slate-500 dark:text-slate-400"
                              >
                                {formatDate(review.createdAtMs)}
                              </time>
                            )}
                          </div>
                        </div>

                        <div
                          role="img"
                          className="flex items-center gap-0.5"
                          aria-label={
                            lang === 'ar'
                              ? `تقييم ${review.rating} من 5 نجوم`
                              : `Rated ${review.rating} out of 5 stars`
                          }
                        >
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Star
                              key={n}
                              className={`h-4 w-4 ${
                                n <= review.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-300 dark:text-slate-600'
                              }`}
                              aria-hidden="true"
                            />
                          ))}
                        </div>
                      </div>

                      <p className="mt-3.5 whitespace-pre-line break-words text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                        {review.comment}
                      </p>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
