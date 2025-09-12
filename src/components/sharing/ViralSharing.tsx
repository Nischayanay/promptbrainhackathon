import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Twitter, Linkedin, Mail, Link, Copy, Gift, Users, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner@2.0.3';

interface ViralSharingProps {
  onEarnCredits?: (credits: number, description: string) => void;
  userReferralCode?: string;
}

export function ViralSharing({ onEarnCredits, userReferralCode = 'PROMPT2024' }: ViralSharingProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const shareUrl = `https://promptbrain.ai?ref=${userReferralCode}`;
  
  const shareTemplates = {
    twitter: `🚀 Just discovered PromptBrain - it transforms messy AI prompts into 10× smarter inputs instantly!

Get 50 free credits to try it: ${shareUrl}

#AI #Productivity #PromptEngineering`,
    
    linkedin: `I've been using PromptBrain to enhance my AI prompts and the results are incredible! 

It takes simple inputs like "write me a pitch" and transforms them into detailed, structured prompts that get 10× better AI outputs.

Perfect for founders, researchers, and anyone working with AI tools. You get 50 free credits to start.

Try it here: ${shareUrl}`,
    
    email: `Subject: This tool makes AI 10× more effective

Hey there!

I found this amazing tool called PromptBrain that completely transforms how I use AI. Instead of getting mediocre outputs from simple prompts, it helps me create detailed, structured prompts that get incredible results.

For example, "write me a pitch" becomes a comprehensive prompt with structure, tone guidelines, target audience specs, and more.

You get 50 free credits to try it out: ${shareUrl}

Thought you might find it useful!`
  };

  const copyToClipboard = (text: string, item: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedItem(item);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopiedItem(null), 2000);
    });
  };

  const handleShare = (platform: string) => {
    const template = shareTemplates[platform as keyof typeof shareTemplates];
    
    if (platform === 'twitter') {
      const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(template)}`;
      window.open(tweetUrl, '_blank');
    } else if (platform === 'linkedin') {
      const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
      window.open(linkedinUrl, '_blank');
    } else if (platform === 'email') {
      const emailUrl = `mailto:?subject=${encodeURIComponent('This tool makes AI 10× more effective')}&body=${encodeURIComponent(template)}`;
      window.open(emailUrl);
    }
    
    // Simulate earning credits for sharing
    setTimeout(() => {
      onEarnCredits?.(10, `Shared on ${platform}`);
      toast.success('🎉 Earned 10 credits for sharing!');
    }, 1000);
  };

  const handleDirectShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'PromptBrain - 10× Smarter AI Prompts',
        text: 'Transform messy prompts into detailed, effective AI inputs',
        url: shareUrl,
      });
    } else {
      copyToClipboard(shareUrl, 'url');
    }
  };

  return (
    <>
      <Button
        onClick={() => setShowShareModal(true)}
        variant="outline"
        className="border-royal-gold/30 text-royal-gold hover:bg-royal-gold/10"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share & Earn Credits
      </Button>

      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-temple-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md mx-4 bg-temple-dark border border-royal-gold/30 rounded-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-royal-gold/10 to-cyan-glow/10 border-b border-royal-gold/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-royal-gold to-cyan-glow rounded-full flex items-center justify-center">
                    <Gift className="w-5 h-5 text-temple-black" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-royal-gold">Share & Earn</h3>
                    <p className="text-sm text-marble-white/70">Get 10 credits for each share</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-cyan-glow">
                    <Users className="w-4 h-4" />
                    <span>Invite friends</span>
                  </div>
                  <div className="flex items-center gap-2 text-royal-gold">
                    <TrendingUp className="w-4 h-4" />
                    <span>Earn credits</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Your Referral Link */}
                <div>
                  <label className="block text-sm font-medium text-marble-white mb-2">
                    Your Referral Link
                  </label>
                  <div className="flex items-center gap-2 p-3 bg-temple-black border border-royal-gold/20 rounded-lg">
                    <span className="flex-1 text-sm text-marble-white/80 truncate">
                      {shareUrl}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => copyToClipboard(shareUrl, 'url')}
                      className="bg-royal-gold/20 hover:bg-royal-gold/30 text-royal-gold border-0"
                    >
                      {copiedItem === 'url' ? 'Copied!' : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Quick Share */}
                <div>
                  <label className="block text-sm font-medium text-marble-white mb-3">
                    Quick Share
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => handleShare('twitter')}
                      className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30"
                    >
                      <Twitter className="w-4 h-4 mr-2" />
                      Twitter
                    </Button>
                    
                    <Button
                      onClick={() => handleShare('linkedin')}
                      className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-600/30"
                    >
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </Button>
                    
                    <Button
                      onClick={() => handleShare('email')}
                      className="bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-600/30"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                    
                    <Button
                      onClick={handleDirectShare}
                      className="bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 border border-gray-600/30"
                    >
                      <Link className="w-4 h-4 mr-2" />
                      More
                    </Button>
                  </div>
                </div>

                {/* Share Templates */}
                <div>
                  <label className="block text-sm font-medium text-marble-white mb-3">
                    Copy Message Templates
                  </label>
                  <div className="space-y-3">
                    {Object.entries(shareTemplates).map(([platform, template]) => (
                      <div
                        key={platform}
                        className="p-3 bg-temple-black border border-royal-gold/10 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-marble-white capitalize">
                            {platform} Template
                          </span>
                          <Button
                            size="sm"
                            onClick={() => copyToClipboard(template, platform)}
                            className="bg-royal-gold/20 hover:bg-royal-gold/30 text-royal-gold border-0"
                          >
                            {copiedItem === platform ? 'Copied!' : <Copy className="w-3 h-3" />}
                          </Button>
                        </div>
                        <p className="text-xs text-marble-white/60 line-clamp-3">
                          {template}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rewards Info */}
                <div className="p-4 bg-gradient-to-r from-royal-gold/5 to-cyan-glow/5 border border-royal-gold/20 rounded-lg">
                  <h4 className="text-sm font-medium text-royal-gold mb-2">
                    🎁 Earning Rewards
                  </h4>
                  <ul className="text-xs text-marble-white/70 space-y-1">
                    <li>• 10 credits for each social media share</li>
                    <li>• 25 credits when a friend signs up with your link</li>
                    <li>• Bonus credits for achieving milestones</li>
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-royal-gold/20">
                <Button
                  onClick={() => setShowShareModal(false)}
                  className="w-full bg-royal-gold text-temple-black font-medium hover:bg-royal-gold/90"
                >
                  Done
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}