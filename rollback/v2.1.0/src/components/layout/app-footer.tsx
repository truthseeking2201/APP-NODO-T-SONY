import TelegramIcon from "@/assets/icons/telegram.svg";
import XIcon from "@/assets/icons/x.svg";

export function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-6 text-center text-100 font-caption border-t border-white/10 bg-transparent">
      <div
        style={{
          maxWidth: "var(--layout-desktop-breakpoint-xl)",
          margin: "0 auto",
          padding: "0 36px",
        }}
        className="flex flex-col md:flex-row justify-between items-center"
      >
        <div>©{currentYear} NODO. All rights reserved</div>
        {/* <div>
          NODO Global Limited 10 Anson Road #22-06 International Plaza,
          Singapore 079903
        </div> */}
      </div>
    </footer>
  );
}
