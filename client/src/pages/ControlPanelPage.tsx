import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  fetchEmailSettings,
  saveEmailSettings,
  sendTestEmailSettings,
} from "../lib/api";

interface EmailSettingsFormData {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  fromAddress: string;
  password: string;
}

export function ControlPanelPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const [configured, setConfigured] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmailSettingsFormData>({
    defaultValues: {
      host: "mail.privateemail.com",
      port: 587,
      secure: false,
      username: "",
      fromAddress: "",
      password: "",
    },
  });

  useEffect(() => {
    const load = async () => {
      try {
        const settings = await fetchEmailSettings();
        reset({
          host: settings.host || "mail.privateemail.com",
          port: settings.port || 587,
          secure: settings.secure,
          username: settings.username || "",
          fromAddress: settings.fromAddress || "",
          password: "",
        });
        setHasPassword(settings.hasPassword);
        setConfigured(settings.configured);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [reset]);

  const onSave = async (data: EmailSettingsFormData) => {
    setIsSaving(true);
    try {
      const payload = {
        host: data.host,
        port: Number(data.port),
        secure: data.secure,
        username: data.username,
        fromAddress: data.fromAddress,
        ...(data.password.trim() ? { password: data.password.trim() } : {}),
      };
      const saved = await saveEmailSettings(payload);
      setHasPassword(saved.hasPassword);
      setConfigured(saved.configured);
      reset({
        ...payload,
        password: "",
      });
      toast.success("Email settings saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const onTest = async () => {
    setIsTesting(true);
    try {
      const result = await sendTestEmailSettings();
      toast.success(result.message || "Test email sent");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send test email");
    } finally {
      setIsTesting(false);
    }
  };

  if (isLoading) {
    return <div className="text-[#697386]">Loading control panel...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#0a2540]">Control Panel</h1>
        <p className="mt-1 text-[#697386]">
          Configure outbound email (privateemail.com SMTP) used for password reset.
          {configured ? (
            <span className="ml-2 text-xs font-medium text-emerald-700">Configured</span>
          ) : (
            <span className="ml-2 text-xs font-medium text-amber-700">Not configured</span>
          )}
        </p>
      </div>

      <section className="rounded-lg border border-[#e3e8ee] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0a2540]">Email / SMTP</h2>
        <p className="mt-1 mb-6 text-sm text-[#697386]">
          Defaults match Namecheap Private Email: host <code>mail.privateemail.com</code>, port{" "}
          <code>587</code> (STARTTLS).
        </p>

        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="smtp-host">SMTP host</Label>
              <Input
                id="smtp-host"
                {...register("host", { required: "Host is required" })}
              />
              {errors.host && (
                <p className="text-sm text-red-600">{errors.host.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="smtp-port">Port</Label>
              <Input
                id="smtp-port"
                type="number"
                {...register("port", {
                  required: "Port is required",
                  valueAsNumber: true,
                })}
              />
              {errors.port && (
                <p className="text-sm text-red-600">{errors.port.message}</p>
              )}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-[#425466]">
            <input type="checkbox" className="size-4 rounded border" {...register("secure")} />
            Use SSL/TLS (secure) — leave unchecked for port 587 STARTTLS
          </label>

          <div className="space-y-1.5">
            <Label htmlFor="smtp-username">Username</Label>
            <Input
              id="smtp-username"
              autoComplete="username"
              placeholder="you@yourdomain.com"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && (
              <p className="text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="smtp-from">From address</Label>
            <Input
              id="smtp-from"
              type="email"
              placeholder="noreply@yourdomain.com"
              {...register("fromAddress", {
                required: "From address is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.fromAddress && (
              <p className="text-sm text-red-600">{errors.fromAddress.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="smtp-password">
              Password {hasPassword ? "(leave blank to keep current)" : ""}
            </Label>
            <Input
              id="smtp-password"
              type="password"
              autoComplete="new-password"
              placeholder={hasPassword ? "••••••••" : "SMTP password"}
              {...register("password", {
                validate: (value) =>
                  hasPassword || (value && value.trim().length > 0)
                    ? true
                    : "Password is required for first-time setup",
              })}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-[#635bff] hover:bg-[#5851ea]"
            >
              {isSaving ? "Saving..." : "Save settings"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isTesting || !configured}
              onClick={onTest}
            >
              {isTesting ? "Sending..." : "Send test email"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
