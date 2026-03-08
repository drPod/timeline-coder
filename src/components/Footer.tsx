import { Github, Linkedin, Mail } from "lucide-react";

const footerLinks = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Mail, href: "mailto:you@example.com", label: "Email" },
];

const Footer = () => {
  return (
    <footer id="footer" className="border-t border-border py-12">
      <div className="flex items-center justify-center gap-6">
        {footerLinks.map(({ icon: Icon, href, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            <Icon className="h-5 w-5" />
          </a>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
