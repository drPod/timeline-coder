import { Github, Linkedin, Mail } from "lucide-react";

const footerLinks = [
  {
    icon: Github,
    href: "https://github.com/drPod",
    label: "github.com/drPod",
    external: true,
  },
  {
    icon: Linkedin,
    href: "https://linkedin.com/in/darshpoddar",
    label: "linkedin.com/in/darshpoddar",
    external: true,
  },
  {
    icon: Mail,
    href: "mailto:darshp3@illinois.edu",
    label: "darshp3@illinois.edu",
    external: false,
  },
];

const Footer = () => {
  return (
    <footer className="relative z-[2] bg-[rgba(0,0,0,0.88)] border-t border-white/5 pt-8 md:pt-12 pb-20 md:pb-16 px-6 md:px-12">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-4">
        <div className="flex flex-row items-center gap-5 flex-wrap">
          {footerLinks.map(({ icon: Icon, href, label, external }) => (
            <a
              key={label}
              href={href}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="flex items-center gap-2 text-[11px] font-mono text-white/40 hover:text-[#3ecf8e] transition-colors"
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{label}</span>
            </a>
          ))}
        </div>

        <div className="h-px bg-[#3ecf8e]/5 my-2" />

        <div className="flex flex-row items-center justify-between text-[10px] font-mono text-white/15">
          <span>built by darsh poddar</span>
          <span>© 2026</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
