import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BrandHexMark } from "@/components/BrandHexMark";
import { SUBSCRIPTION_USD_MONTHLY } from "@/lib/pricing";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Shield,
  CreditCard,
  Check,
  Loader2,
  Zap,
  Globe,
  BarChart3,
  Brain,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const FEATURES = [
  { icon: BarChart3, text: "AI intelligence across all industries" },
  { icon: Brain, text: "Deep dives, frameworks & scoring" },
  { icon: Globe, text: "Cross-industry & cross-region scans" },
  { icon: Zap, text: "Infinity Lab — unlimited custom questions" },
];

export function PaymentModal({ open, onOpenChange, onSuccess }: PaymentModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!user?.email) {
      toast.error("Please sign in first");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("paystack-initialize", {
        body: {
          callbackUrl: `${window.location.origin}/dashboard?payment=verify`,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.authorization_url) {
        localStorage.setItem("paystack_reference", data.reference);
        window.location.href = data.authorization_url;
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to initialize payment");
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden gap-0 rounded-2xl border-border/60">
        {/* Header with branding */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-6 pt-6 pb-4">
          <DialogHeader className="space-y-3 text-left">
            <div className="flex items-center gap-3">
              <BrandHexMark size="md" />
              <div>
                <DialogTitle className="text-lg font-display font-bold text-foreground">
                  Upgrade to Pro
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Full access to Infinitygap intelligence
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Price display */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-display font-bold text-foreground">
              ${SUBSCRIPTION_USD_MONTHLY}
            </span>
            <span className="text-sm text-muted-foreground">/month</span>
            <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              Cancel anytime
            </span>
          </div>

          {/* Features list */}
          <div className="space-y-2.5">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  <f.icon className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-foreground/90">{f.text}</span>
              </div>
            ))}
          </div>

          {/* Billing info */}
          <div className="rounded-xl border border-border/60 bg-muted/30 p-3 space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Billed to</span>
              <span className="font-medium text-foreground truncate max-w-[200px]">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Billing cycle</span>
              <span className="font-medium text-foreground">Monthly (auto-renew)</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-bold text-foreground">${SUBSCRIPTION_USD_MONTHLY}.00 USD</span>
            </div>
          </div>

          {/* CTA */}
          <Button
            onClick={handlePayment}
            disabled={loading}
            className="w-full h-12 rounded-xl font-bold text-base gap-2 shadow-lg shadow-primary/20"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing…
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4" />
                Subscribe — ${SUBSCRIPTION_USD_MONTHLY}/mo
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-4 pt-1">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Shield className="h-3 w-3" />
              <span>256-bit SSL</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Check className="h-3 w-3" />
              <span>PCI compliant</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <CreditCard className="h-3 w-3" />
              <span>Powered by Paystack</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
