import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-a5822d33/health", (c) => {
  return c.json({ status: "ok" });
});

// Contact form endpoint
app.post("/make-server-a5822d33/contact", async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return c.json({ error: "All fields are required" }, 400);
    }

    // Store the contact submission in KV store as a backup
    const timestamp = new Date().toISOString();
    const submissionId = `contact_${Date.now()}`;
    await kv.set(submissionId, {
      name,
      email,
      subject,
      message,
      timestamp,
    });

    // Send email using Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      console.error("RESEND_API_KEY environment variable is not set");
      return c.json({ 
        error: "Email service not configured. Contact submission saved." 
      }, 500);
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: ["p@nelan.dev"],
        subject: `Portfolio Contact: ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <h3>Message:</h3>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><small>Submitted at: ${timestamp}</small></p>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Error sending email via Resend:", errorText);
      return c.json({ 
        error: "Failed to send email. Contact submission saved.",
        details: errorText 
      }, 500);
    }

    const emailData = await emailResponse.json();
    console.log("Email sent successfully via Resend:", emailData);

    return c.json({ 
      success: true, 
      message: "Contact form submitted and email sent successfully",
      submissionId 
    });
  } catch (error) {
    console.error("Error processing contact form submission:", error);
    return c.json({ 
      error: "Failed to process contact form", 
      details: error.message 
    }, 500);
  }
});

Deno.serve(app.fetch);