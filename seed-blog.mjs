import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const content = `<h2>The Art of Thoughtful Gifting</h2>
<p>Choosing a gift is not just about picking something pretty off a shelf — it is about showing someone you truly know them. A beautifully curated gift box does exactly that: it tells a story, evokes emotion, and creates a lasting memory.</p>

<h2>Step 1: Think About the Recipient</h2>
<p>Before you browse, ask yourself a few questions:</p>
<ul>
<li>What do they love doing on weekends?</li>
<li>Are they more of a cosy-nights-in person or a go-getter?</li>
<li>Do they have a sweet tooth, or do they prefer savoury treats?</li>
<li>Are they into wellness, luxury, or practicality?</li>
</ul>
<p>The answers will immediately narrow down your options and make the choice feel personal rather than generic.</p>

<h2>Step 2: Consider the Occasion</h2>
<p>Context matters enormously. A birthday gift has a completely different energy to a corporate thank-you or a new baby present. At Giftora, we curate collections for every milestone — from <strong>new hire welcome boxes</strong> to <strong>Valentine's Day romantic sets</strong> — so you will always find something that feels exactly right.</p>

<blockquote>
<p>The best gift is one that shows you were paying attention.</p>
</blockquote>

<h2>Step 3: Set a Budget You are Comfortable With</h2>
<p>Thoughtfulness is not measured in euros. Our gift boxes range from under 50 euros right through to premium corporate prestige sets at 120 euros and above. Every single box is curated with the same care — the only difference is what is inside.</p>

<h2>Step 4: Personalise Where You Can</h2>
<p>A handwritten note changes everything. Even a few sincere words — <em>I thought of you when I saw this</em> — transforms a beautiful box into a truly unforgettable moment. We offer personalisation options on selected boxes, so you can make it completely yours.</p>

<h2>Our Top Picks Right Now</h2>
<p>If you are still unsure, here are some of our most-loved gift boxes to get you started:</p>
<ul>
<li><strong>The Executive Welcome Box</strong> — Perfect for new hires and corporate milestones</li>
<li><strong>Luxury Self-Care Ritual Box</strong> — For someone who deserves a proper treat</li>
<li><strong>Festive Christmas Luxury Box</strong> — A crowd-pleaser every single time</li>
<li><strong>Birthday Bliss Box</strong> — Because every birthday deserves something special</li>
</ul>

<h2>Ready to Find Your Perfect Gift?</h2>
<p>Browse our full collection and filter by occasion, budget, or recipient. Every box ships beautifully packaged — because the unwrapping is part of the gift.</p>`;

async function main() {
  const post = await prisma.blogPost.upsert({
    where: { slug: 'how-to-choose-the-perfect-gift-box' },
    update: { published: true, publishedAt: new Date() },
    create: {
      title: 'How to Choose the Perfect Gift Box for Any Occasion',
      slug: 'how-to-choose-the-perfect-gift-box',
      excerpt: 'Gift-giving can feel overwhelming — but it does not have to be. Here is our guide to picking a gift box that will genuinely delight.',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200',
      authorId: 'admin',
      authorName: 'Giftora Team',
      published: true,
      publishedAt: new Date(),
      tags: ['Gift Guide', 'Tips'],
      content,
    },
  });
  console.log('Created post:', post.title);

  const post2 = await prisma.blogPost.upsert({
    where: { slug: '5-reasons-gift-boxes-beat-individual-gifts' },
    update: { published: true, publishedAt: new Date(Date.now() - 86400000 * 3) },
    create: {
      title: '5 Reasons a Curated Gift Box Always Beats Individual Gifts',
      slug: '5-reasons-gift-boxes-beat-individual-gifts',
      excerpt: 'Still wrapping five separate gifts in five different bags? Here is why a single curated gift box is always the better choice.',
      image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=1200',
      authorId: 'admin',
      authorName: 'Giftora Team',
      published: true,
      publishedAt: new Date(Date.now() - 86400000 * 3),
      tags: ['Gift Ideas', 'Lifestyle'],
      content: `<h2>One Box, Infinite Impressions</h2>
<p>There is something magical about receiving a beautifully packaged gift box. The anticipation as you lift the lid. The tissue paper. The carefully arranged items inside. It is an experience — not just a transaction.</p>

<h2>1. It Tells a Story</h2>
<p>A curated gift box is more than the sum of its parts. Each item is chosen to complement the others, creating a cohesive experience. A single scented candle is nice. Paired with bath salts, a silk sleep mask, and artisan herbal tea? That is a <em>ritual</em>.</p>

<h2>2. The Presentation Does the Work for You</h2>
<p>Every Giftora box arrives beautifully packaged, ready to gift. No wrapping paper. No tape. No last-minute panic. Just open the door, hand it over, and watch their face light up.</p>

<h2>3. It Feels Considered</h2>
<p>Even if you spent fifteen minutes choosing it, a curated box <strong>feels like hours of thoughtfulness</strong>. The curation process has already been done — you just need to pick the right theme for the right person.</p>

<h2>4. It Suits Every Budget</h2>
<p>From our Under 50 euros collection to premium corporate sets, there is a Giftora box for every occasion and every budget. You never have to compromise on quality — just choose your price point.</p>

<h2>5. It is Memorable</h2>
<p>People forget individual gifts. They remember experiences. A beautiful gift box — with a handwritten note, premium contents, and elegant packaging — becomes a memory. That is the Giftora difference.</p>

<h2>Ready to Make Someone's Day?</h2>
<p>Browse our gift box collections and find the perfect match. Free delivery on orders over 75 euros. Every box ships in 1-2 working days.</p>`,
    },
  });
  console.log('Created post:', post2.title);

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
