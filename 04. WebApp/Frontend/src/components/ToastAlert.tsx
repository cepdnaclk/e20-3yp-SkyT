import Swal from "sweetalert2";

type ToastOptions = {
  timer?: number;
  title: string;
  type: "success" | "error" | "warning" | "info" | "question";
  position?:
    | "top"
    | "top-start"
    | "top-end"
    | "center"
    | "center-start"
    | "center-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end";
  onClose?: () => void;
};

export function ToastAlert({
  timer = 3000,
  title,
  type,
  position = "top-end",
  onClose,
}: ToastOptions) {
  const Toast = Swal.mixin({
    toast: true,
    position: position || "top-end",
    showConfirmButton: false,
    timer: timer || 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;

      // Set inline font style here
      const container = toast.querySelector(".swal2-title");
      if (container) {
        (container as HTMLElement).style.fontFamily = "Montserrat";
        (container as HTMLElement).style.fontSize = "14px";
      }
    },
    didClose: onClose,
  });

  Toast.fire({
    icon: type,
    title: title,
  });
}
