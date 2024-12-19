import { Input } from "../ui/input";
import { Link } from "lucide-react";

interface SocialLinksProps {
  formData: {
    website: string;
    twitter: string;
    telegram: string;
    discord: string;
  };
  onFieldChange: (field: string, value: string) => void;
}

export const SocialLinks = ({ formData, onFieldChange }: SocialLinksProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Social Links</h3>
      <div className="grid gap-4">
        <div className="flex items-center space-x-2">
          <Link className="w-5 h-5" />
          <Input
            id="website"
            placeholder="Website URL"
            value={formData.website}
            onChange={(e) => onFieldChange("website", e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
          </svg>
          <Input
            id="twitter"
            placeholder="Twitter URL"
            value={formData.twitter}
            onChange={(e) => onFieldChange("twitter", e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.5 4.5L2.5 12.5L21.5 20.5L21.5 4.5Z" />
            <path d="M21.5 4.5L2.5 12.5V19.5L21.5 4.5Z" />
          </svg>
          <Input
            id="telegram"
            placeholder="Telegram URL"
            value={formData.telegram}
            onChange={(e) => onFieldChange("telegram", e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5.5 8.5C9 8.5 11.5 6 11.5 6C11.5 6 14 8.5 17.5 8.5C20 8.5 22 6.5 22 6.5V19.5C22 19.5 20 21.5 17.5 21.5C14 21.5 11.5 19 11.5 19C11.5 19 9 21.5 5.5 21.5C3 21.5 1 19.5 1 19.5V6.5C1 6.5 3 8.5 5.5 8.5Z" />
          </svg>
          <Input
            id="discord"
            placeholder="Discord URL"
            value={formData.discord}
            onChange={(e) => onFieldChange("discord", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};