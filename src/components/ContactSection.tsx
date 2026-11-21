import { useState, type FormEvent } from 'react';
import {
  AlertCircle,
  Check,
  Copy,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getPortfolioContent } from '../data/portfolioData';
import { trackEvent } from '../utils/analytics';

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactSection() {
  const { lang } = useLanguage();
  const { personal, contactSection } = getPortfolioContent(lang);
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [emailCopied, setEmailCopied] = useState(false);
  const [draftCopied, setDraftCopied] = useState(false);
  const [submittedMailto, setSubmittedMailto] = useState(false);

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      nextErrors.name = contactSection.errors.name;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim() || !emailPattern.test(form.email.trim())) {
      nextErrors.email = contactSection.errors.email;
    }
    if (!form.subject.trim() || form.subject.trim().length < 3) {
      nextErrors.subject = contactSection.errors.subject;
    }
    if (!form.message.trim() || form.message.trim().length < 10) {
      nextErrors.message = contactSection.errors.message;
    }
    return nextErrors;
  };

  const buildMailtoHref = () => {
    const subject = encodeURIComponent(form.subject.trim());
    const body = encodeURIComponent(
      `Name: ${form.name.trim()}\nEmail: ${form.email.trim()}\n\n${form.message.trim()}`,
    );
    return `mailto:${personal.email}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setSubmittedMailto(false);
      return;
    }

    setSubmittedMailto(true);
    trackEvent('Contact Action', { section: 'contact', action: 'open_mailto_form' });
    window.location.href = buildMailtoHref();
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personal.email);
      setEmailCopied(true);
      trackEvent('Contact Action', { section: 'contact', action: 'copy_email' });
      window.setTimeout(() => setEmailCopied(false), 2500);
    } catch {
      // Clipboard may be restricted; mailto link remains active
    }
  };

  const handleCopyDraft = async () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const text = `To: ${personal.email}\nSubject: ${form.subject.trim()}\nFrom: ${form.name.trim()} (${form.email.trim()})\n\n${form.message.trim()}`;
    try {
      await navigator.clipboard.writeText(text);
      setDraftCopied(true);
      window.setTimeout(() => setDraftCopied(false), 2500);
    } catch {
      window.location.href = buildMailtoHref();
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
            {contactSection.kicker}
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {contactSection.heading}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
            {contactSection.subheading}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Direct Contact Channels */}
          <div className="space-y-4 lg:col-span-5">
            <div className="rounded-xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-[#0B1120] p-5 shadow-xs dark:shadow-none">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-500/30 dark:bg-blue-600/10 dark:text-blue-400">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {contactSection.emailLabel}
                    </p>
                    <a
                      href={`mailto:${personal.email}`}
                      dir="ltr"
                      className="mt-0.5 block break-all text-sm font-semibold text-slate-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 transition-colors"
                    >
                      {personal.email}
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  aria-label="Copy email address"
                  className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300 dark:hover:bg-white/[0.08] dark:hover:text-white transition-colors cursor-pointer"
                >
                  {emailCopied ? (
                    <>
                      <Check
                        className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400"
                        aria-hidden="true"
                      />
                      <span className="text-emerald-700 dark:text-emerald-300">
                        {contactSection.copied}
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{contactSection.copy}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <a
              href={`tel:${personal.phoneHref}`}
              className="flex items-center gap-3.5 rounded-xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-[#0B1120] p-5 shadow-xs dark:shadow-none hover:border-blue-500/50 dark:hover:border-blue-500/40 transition-colors"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-500/30 dark:bg-blue-600/10 dark:text-blue-400">
                <Phone className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {contactSection.phoneLabel}
                </p>
                <p
                  dir="ltr"
                  className="mt-0.5 font-mono text-sm font-semibold text-slate-900 dark:text-white tabular-nums"
                >
                  {personal.phone}
                </p>
              </div>
            </a>

            <div className="flex items-center gap-3.5 rounded-xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-[#0B1120] p-5 shadow-xs dark:shadow-none">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-500/30 dark:bg-blue-600/10 dark:text-blue-400">
                <MapPin className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {contactSection.locationLabel}
                </p>
                <p className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-white">
                  {personal.location}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <a
                href={personal.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-[#0B1120] px-4 py-4 text-sm font-semibold text-slate-900 dark:text-white shadow-xs dark:shadow-none hover:border-blue-500/50 dark:hover:border-blue-500/40 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Linkedin className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  <span>LinkedIn</span>
                </span>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              </a>

              <a
                href={personal.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-[#0B1120] px-4 py-4 text-sm font-semibold text-slate-900 dark:text-white shadow-xs dark:shadow-none hover:border-blue-500/50 dark:hover:border-blue-500/40 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Github className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  <span>GitHub</span>
                </span>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Validated Contact Form with Mailto Integration */}
          <div className="rounded-2xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-[#0B1120] p-6 sm:p-8 shadow-xs dark:shadow-none lg:col-span-7">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              {contactSection.formTitle}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              {contactSection.formIntroBefore}{' '}
              <span dir="ltr" className="font-medium text-slate-900 dark:text-slate-200">
                {personal.email}
              </span>
              {contactSection.formIntroAfter}
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    {contactSection.nameLabel}
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => {
                      setForm({ ...form, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: undefined });
                    }}
                    placeholder={contactSection.namePlaceholder}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-white/15 dark:bg-[#060A13] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:bg-[#060A13]"
                  />
                  {errors.name && (
                    <p
                      id="contact-name-error"
                      className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400"
                    >
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    {contactSection.emailInputLabel}
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    dir="ltr"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => {
                      setForm({ ...form, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    placeholder={contactSection.emailPlaceholder}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'contact-email-error' : undefined}
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-white/15 dark:bg-[#060A13] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:bg-[#060A13] rtl:text-right"
                  />
                  {errors.email && (
                    <p
                      id="contact-email-error"
                      className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400"
                    >
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="block text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  {contactSection.subjectLabel}
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={(e) => {
                    setForm({ ...form, subject: e.target.value });
                    if (errors.subject) setErrors({ ...errors, subject: undefined });
                  }}
                  placeholder={contactSection.subjectPlaceholder}
                  aria-invalid={Boolean(errors.subject)}
                  aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-white/15 dark:bg-[#060A13] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:bg-[#060A13]"
                />
                {errors.subject && (
                  <p
                    id="contact-subject-error"
                    className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400"
                  >
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{errors.subject}</span>
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  {contactSection.messageLabel}
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={(e) => {
                    setForm({ ...form, message: e.target.value });
                    if (errors.message) setErrors({ ...errors, message: undefined });
                  }}
                  placeholder={contactSection.messagePlaceholder}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'contact-message-error' : undefined}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-white/15 dark:bg-[#060A13] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:bg-[#060A13]"
                />
                {errors.message && (
                  <p
                    id="contact-message-error"
                    className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400"
                  >
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{errors.message}</span>
                  </p>
                )}
              </div>

              {submittedMailto && (
                <div
                  role="status"
                  className="flex items-start gap-2.5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-900 dark:border-blue-500/30 dark:bg-blue-600/10 dark:text-blue-200"
                >
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400"
                    aria-hidden="true"
                  />
                  <span>
                    {contactSection.statusMessagePrefix}{' '}
                    <span dir="ltr">{personal.email}</span>
                    {contactSection.statusMessageSuffix}
                  </span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="submit"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 active:bg-blue-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Send className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                  <span>{contactSection.submitButton}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyDraft}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-100 dark:border-white/15 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.09] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {draftCopied ? (
                    <>
                      <Check
                        className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
                        aria-hidden="true"
                      />
                      <span className="text-emerald-700 dark:text-emerald-300">
                        {contactSection.draftCopied}
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
                      <span>{contactSection.copyDraftButton}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
