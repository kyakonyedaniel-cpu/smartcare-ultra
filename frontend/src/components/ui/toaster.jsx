import { useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 w-full max-w-md p-4">
      {toasts.map(({ id, title, description, variant, ...props }) => (
        <div
          key={id}
          className={`p-4 rounded-lg border shadow-md transition-all ${
            variant === "destructive"
              ? "bg-red-50 border-red-200 text-red-900"
              : "bg-white border-gray-200"
          }`}
          {...props}
        >
          {title && <div className="font-medium">{title}</div>}
          {description && <div className="text-sm text-muted-foreground">{description}</div>}
        </div>
      ))}
    </div>
  )
}
