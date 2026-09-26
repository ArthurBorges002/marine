import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as "light" | "dark" | "system"}
      toastOptions={{
        style: {
          background: "hsl(var(--background))",
          border: "1px solid hsl(var(--border))",
          color: "hsl(var(--foreground))",
          fontSize: "0.9rem",
          borderRadius: "0.6rem",
        },
        classNames: {
          success:
            "bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-200 border-green-400",
          error:
            "bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200 border-red-400",
          warning:
            "bg-yellow-50 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-200 border-yellow-400",
          info:
            "bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-200 border-blue-400",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
