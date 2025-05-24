
// Remove the conflicting re-export that's causing the context consumer error
// The useToast hook should be imported directly from @/hooks/use-toast

export * from "@/hooks/use-toast";
