/**
 * Progressive enhancement for lead forms ([data-lead-form]).
 * - Accessible inline validation + error summary (focus moves to summary).
 * - Analytics: <prefix>_view / _start / _submit / _error / _success.
 * - Posts a typed Lead (src/lib/leads.ts) as JSON to data-endpoint.
 * - With no endpoint configured, it never pretends: it tells the user and
 *   offers a pre-filled email containing their details instead.
 */
import { track } from './analytics';
import type { Lead, LeadType } from '../lib/leads';

const UTM_KEYS = ['source', 'medium', 'campaign', 'term', 'content'] as const;

function captureUtm() {
  const params = new URLSearchParams(location.search);
  const found = Object.fromEntries(UTM_KEYS.map((k) => [k, params.get(`utm_${k}`)]).filter(([, v]) => v));
  try {
    if (Object.keys(found).length) sessionStorage.setItem('1s_utm', JSON.stringify(found));
    return JSON.parse(sessionStorage.getItem('1s_utm') || '{}');
  } catch {
    return found;
  }
}

const utm = captureUtm();

function fieldLabel(field: HTMLElement) {
  const text = field.querySelector('.field__label, legend')?.textContent ?? '';
  return text.replace(/\((required|optional|choose at least one)\)/i, '').trim();
}

function validateField(field: HTMLElement): boolean {
  const error = field.querySelector<HTMLElement>('.field__error');
  const control = field.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('.field__input');
  let message = '';

  if (field.hasAttribute('data-required-one')) {
    const any = field.querySelector('input[type=checkbox]:checked');
    if (!any) message = error?.dataset.errorMessage ?? 'Choose at least one option.';
    field.setAttribute('aria-invalid', String(Boolean(message)));
  } else if (control) {
    control.value = control.value.trim();
    if (!control.checkValidity()) {
      const v = control.validity;
      if (v.valueMissing) message = error?.dataset.errorMessage ?? 'This field is required.';
      else if (v.typeMismatch && control.type === 'email') message = 'Enter an email address like name@company.com.';
      else if (v.typeMismatch && control.type === 'url') message = 'Enter a web address like https://yourstore.com.';
      else message = 'Please check this field.';
    }
    control.setAttribute('aria-invalid', String(Boolean(message)));
  }

  if (error) {
    error.textContent = message;
    error.hidden = !message;
  }
  return !message;
}

function buildLead(form: HTMLFormElement): Lead {
  const fd = new FormData(form);
  const get = (k: string) => (fd.get(k) as string | null)?.trim() || undefined;
  const all = (k: string) => fd.getAll(k).map(String);
  const topic = get('topic');
  let type = (form.dataset.leadType as LeadType) || 'contact';
  if (type === 'contact' && topic === 'brand') type = 'brand_inquiry';

  return {
    type,
    submittedAt: new Date().toISOString(),
    page: location.pathname,
    utm,
    contact: { name: get('name') ?? '', email: get('email') ?? '', phone: get('phone'), role: get('role') },
    company: get('company')
      ? {
          name: get('company')!,
          website: get('website'),
          businessType: get('businessType'),
          address: { street: get('street'), city: get('city'), region: get('region'), postalCode: get('postalCode'), country: 'US' },
        }
      : undefined,
    purchasing: form.dataset.leadType === 'account_application'
      ? { channels: all('channels'), categories: all('categories'), monthlyVolume: get('monthlyVolume'), resaleCertificate: get('resaleCertificate') }
      : undefined,
    topic,
    message: get('message'),
    referral: get('referral'),
  };
}

function leadAsText(lead: Lead) {
  const lines: string[] = [];
  const add = (k: string, v?: string | string[]) => { if (v && (!Array.isArray(v) || v.length)) lines.push(`${k}: ${Array.isArray(v) ? v.join(', ') : v}`); };
  add('Name', lead.contact.name); add('Email', lead.contact.email); add('Phone', lead.contact.phone);
  add('Company', lead.company?.name); add('Website', lead.company?.website); add('Business type', lead.company?.businessType);
  const a = lead.company?.address; if (a) add('Address', [a.street, a.city, a.region, a.postalCode].filter(Boolean).join(', '));
  add('Sales channels', lead.purchasing?.channels); add('Categories', lead.purchasing?.categories);
  add('Estimated monthly purchasing', lead.purchasing?.monthlyVolume); add('Resale certificate', lead.purchasing?.resaleCertificate);
  add('Topic', lead.topic); add('How they heard about us', lead.referral);
  if (lead.message) lines.push('', lead.message);
  return lines.join('\n');
}

function initForm(form: HTMLFormElement) {
  const prefix = form.dataset.eventPrefix || 'contact_form';
  const endpoint = form.dataset.endpoint;
  const summary = form.querySelector<HTMLElement>('[data-summary]');
  const notice = form.querySelector<HTMLElement>('[data-notice]');
  const submit = form.querySelector<HTMLButtonElement>('[type=submit]');
  const fields = [...form.querySelectorAll<HTMLElement>('[data-field]')];
  let started = false;

  form.noValidate = true;
  if (form.dataset.trackView !== undefined) track(`${prefix}_view`);

  form.addEventListener('input', () => {
    if (!started) { started = true; track(`${prefix}_start`); }
  });
  // Re-validate a field once it has been flagged, so errors clear as the user fixes them.
  form.addEventListener('change', (e) => {
    const field = (e.target as HTMLElement).closest<HTMLElement>('[data-field]');
    if (field && (field.querySelector('[aria-invalid=true]') || field.getAttribute('aria-invalid') === 'true')) validateField(field);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if ((form.querySelector('[name=company_url]') as HTMLInputElement | null)?.value) return; // honeypot

    const invalid = fields.filter((f) => !validateField(f));
    if (invalid.length && summary) {
      summary.innerHTML = `<h2 tabindex="-1">Please fix ${invalid.length === 1 ? '1 field' : `${invalid.length} fields`} to continue</h2><ul>${invalid
        .map((f) => {
          const target = f.querySelector('input, select, textarea') as HTMLElement | null;
          return `<li><a href="#${target?.id ?? ''}">${fieldLabel(f)}</a></li>`;
        })
        .join('')}</ul>`;
      summary.hidden = false;
      summary.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      summary.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true });
      track(`${prefix}_error`, { fields: invalid.map(fieldLabel).join('|') });
      return;
    }
    if (summary) summary.hidden = true;

    const lead = buildLead(form);
    track(`${prefix}_submit`, { lead_type: lead.type });

    if (!endpoint) {
      const subject = lead.type === 'account_application' ? `Wholesale account application — ${lead.company?.name ?? lead.contact.name}` : `Website enquiry — ${lead.contact.name}`;
      const mailto = `mailto:${form.dataset.fallbackEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(leadAsText(lead))}`;
      if (notice) {
        notice.innerHTML = `<p><strong>Online submissions aren’t connected yet.</strong> Nothing has been sent. Your details are ready to go as an email instead.</p><p><a href="${mailto}" data-event="email_click" data-event-location="${prefix}_fallback">Send my details by email</a> or call <a href="tel:${form.dataset.fallbackPhone}">${form.dataset.fallbackPhoneDisplay}</a>.</p>`;
        notice.hidden = false;
        notice.focus();
      }
      return;
    }

    submit?.setAttribute('aria-busy', 'true');
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(lead),
      });
      if (!res.ok) throw new Error(String(res.status));
      track(`${prefix}_success`, { lead_type: lead.type });
      if (form.dataset.successUrl) location.assign(form.dataset.successUrl);
      else if (notice) {
        form.querySelectorAll('.form__section, .form__actions').forEach((el) => ((el as HTMLElement).hidden = true));
        notice.innerHTML = `<p><strong>Thank you — your message has been sent.</strong> We reply within ${form.dataset.responseTime}.</p>`;
        notice.classList.add('form__notice--ok');
        notice.hidden = false;
        notice.focus();
      }
    } catch (err) {
      track(`${prefix}_error`, { fields: 'network', detail: String(err) });
      if (notice) {
        notice.innerHTML = `<p><strong>Something went wrong sending your details.</strong> Please try again, email <a href="mailto:${form.dataset.fallbackEmail}">${form.dataset.fallbackEmail}</a> or call <a href="tel:${form.dataset.fallbackPhone}">${form.dataset.fallbackPhoneDisplay}</a>.</p>`;
        notice.hidden = false;
        notice.focus();
      }
    } finally {
      submit?.removeAttribute('aria-busy');
    }
  });
}

document.querySelectorAll<HTMLFormElement>('form[data-lead-form]').forEach(initForm);
