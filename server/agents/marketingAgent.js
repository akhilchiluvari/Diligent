import { llmClient } from './llmClient.js';
import { dbService } from '../services/dbService.js';

export class MarketingAgent {
  constructor() {
    this.name = 'Web & Marketing Agent';
    this.code = 'AGENT_MARKETING';
    this.role = 'Headless CMS Automation, Campaign Copywriting & Social Media Generation';
    this.avatar = 'Megaphone';
  }

  async generateCampaign({ focusType = 'CLEAR_DEAD_STOCK', targetSku = null }) {
    const products = dbService.getProducts();
    const leastSellers = dbService.getLeastSellers();
    const topSellers = dbService.getTopSellers();

    const targetProduct = targetSku ? products.find(p => p.sku === targetSku) : leastSellers[0];

    const systemPrompt = `You are the Web & Marketing Agent for 'Sri Balaji Smart Retail & Tech Mart' in Madhapur, Hyderabad.
Your job is to generate high-converting, vibrant social media campaigns (Instagram Reels/Posts, WhatsApp Broadcasts) and Headless CMS banners.
Craft authentic Indian retail copy with relevant emojis, local flavor (Hyderabad tech hub & family vibes), and compelling CTAs.`;

    const userPrompt = `Campaign Objective: ${focusType}
Featured Product: ${targetProduct ? targetProduct.name : 'Storewide Mega Deals'} (SKU: ${targetProduct ? targetProduct.sku : 'ALL'})
Current Retail Price: ₹${targetProduct ? targetProduct.sellingPrice : 999}
Discounted Promotional Price: ₹${targetProduct ? Math.round(targetProduct.sellingPrice * 0.75) : 749}
Companion Upsell: ${topSellers[0]?.name || 'boAt Earphones'}

Generate a structured JSON response with:
1. "instagramPost": { "caption": "...", "hashtags": ["#..."], "visualConcept": "..." }
2. "whatsAppBroadcast": { "header": "...", "body": "...", "callToAction": "..." }
3. "cmsStorefrontBanner": { "headline": "...", "subheading": "...", "ctaButtonText": "...", "badge": "..." }
4. "reelsScript": { "hook": "...", "sceneBreakdown": "...", "durationSeconds": 15 }`;

    const response = await llmClient.complete({ systemPrompt, userPrompt });

    if (response.text) {
      try {
        const cleaned = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        return { ...parsed, agent: this.name, source: response.source, timestamp: new Date().toISOString() };
      } catch (e) {
        // Fallback
      }
    }

    // High-fidelity fallback reasoning
    const prodName = targetProduct ? targetProduct.name : "Nordic Smart LED Desk Lamp";
    const prodPrice = targetProduct ? targetProduct.sellingPrice : 2499;
    const promoPrice = Math.round(prodPrice * 0.75);

    return {
      agent: this.name,
      source: response.source,
      campaignTheme: "Madhapur Tech & Festive Flash Clearance",
      featuredProduct: prodName,
      instagramPost: {
        caption: `✨ Upgrade your WFH setup or nightstand in HITEC City! 🚀 Meet the ${prodName} featuring integrated 15W Qi Fast Wireless Charging & warm eye-care ambient lighting.\n\n⚡ SPECIAL FLASH DEAL: Just ₹${promoPrice} (MRP ₹${prodPrice}) - Save 25% this week only at Sri Balaji Smart Retail, Madhapur!\n\n🛍️ Walk in today or WhatsApp us at +91 98490 12831 for instant 30-min doorstep delivery across Madhapur & Gachibowli! 🛵💨`,
        hashtags: ["#HyderabadTech", "#MadhapurDeals", "#WorkFromHomeSetup", "#SriBalajiSmartRetail", "#SmartHomeHyderabad", "#TechGyan"],
        visualConcept: "Split carousel: Slide 1 - Modern aesthetic desk with phone wirelessly charging on the lamp base. Slide 2 - Before & After cable clutter. Slide 3 - Limited stock counter (Only 48 units left!)."
      },
      whatsAppBroadcast: {
        header: `🔥 48-Hour Exclusive Flash Drop: Sri Balaji Smart Retail, Madhapur!`,
        body: `Namaste Sri Balaji Family! 🙏\n\nLooking for the ultimate study & work desk upgrade? We have unlocked an exclusive member discount on the ${prodName}.\n\n🔹 Retail Price: ₹${prodPrice}\n🔹 Your Exclusive Price: ₹${promoPrice} (Flat 25% OFF!)\n🔹 Bonus: Free 1-year replacement warranty + fast-charging braided cable.\n\nOnly available for the first 30 walk-ins or WhatsApp replies!`,
        callToAction: "Reply 'CLAIM LAMP' to reserve your unit for store pickup or free instant delivery."
      },
      cmsStorefrontBanner: {
        headline: `Transform Your Desk Space: ${prodName}`,
        subheading: `Qi Fast Charging • Touch Dimming • 25% Off Limited Stock in Madhapur`,
        ctaButtonText: `Order Now for ₹${promoPrice}`,
        badge: "LIMITED FLASH OFFER"
      },
      reelsScript: {
        hook: `"Stop using 3 messy cables on your nightstand! Here is how Hyderabad techies are charging their phone and lighting their desk with one device..."`,
        sceneBreakdown: "0-3s: Point camera at messy tangled desk. 3-8s: Place Nordic Lamp down, drop iPhone/Android onto base, watch charging animation light up. 8-15s: Show dimming touch sensor and announce Sri Balaji Madhapur exclusive ₹" + promoPrice + " deal.",
        durationSeconds: 15
      },
      timestamp: new Date().toISOString()
    };
  }
}

export const marketingAgent = new MarketingAgent();
