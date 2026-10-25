"use client";
import { useState, useSyncExternalStore } from "react";
const subscribe = () => () => {};
const clientReady = () => true;
const serverReady = () => false;
export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const ready = useSyncExternalStore(subscribe, clientReady, serverReady);
  return (
    <form
      className="contact-form"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
      onChange={() => setSubmitted(false)}
    >
      <fieldset className="contact-fields" disabled={!ready}>
      <legend className="sr-only">Demo enquiry preview</legend>
      <label>
        Your name
        <input name="name" autoComplete="name" required maxLength={100} />
      </label>
      <label>
        Email address
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={200}
        />
      </label>
      <label>
        Tell us about your space
        <textarea name="message" required minLength={10} maxLength={3000} />
      </label>
      <p className="preview-note" id="demo-notice">
        Portfolio demo: this form validates locally. No information is sent or
        stored.
      </p>
      <button
        className="submit-button"
        type="submit"
        aria-describedby="demo-notice"
      >
        Preview enquiry <span aria-hidden="true">↗</span>
      </button>
      {submitted && (
        <p role="status" className="form-status">
          Your enquiry preview is ready. This is a fictional studio demo; your
          message has not been sent or stored.
        </p>
      )}
      </fieldset>
      {!ready && <p className="preview-note">Enable JavaScript to preview an enquiry locally. This demo form is disabled so your details cannot be submitted.</p>}
    </form>
  );
}
