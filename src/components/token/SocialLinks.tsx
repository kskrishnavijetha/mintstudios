import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SocialLinksProps {
  formData: {
    website: string;
    twitter: string;
    telegram: string;
    discord: string;
  };
  setFormData: (data: any) => void;
}

const SocialLinks = ({ formData, setFormData }: SocialLinksProps) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          type="url"
          placeholder="https://yourwebsite.com"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="twitter">Twitter</Label>
        <Input
          id="twitter"
          placeholder="@yourtwitter"
          value={formData.twitter}
          onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="telegram">Telegram</Label>
        <Input
          id="telegram"
          placeholder="t.me/yourtelegram"
          value={formData.telegram}
          onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="discord">Discord</Label>
        <Input
          id="discord"
          placeholder="discord.gg/yourdiscord"
          value={formData.discord}
          onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
        />
      </div>
    </div>
  );
};

export default SocialLinks;