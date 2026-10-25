// Authored lesson content. User responses are stored separately (see src/lib/store.tsx).
//
// The program follows the ideas in Alison Fragale's research on status at work
// (Likeable Badass): respect is granted by other people, the women who get ahead
// are seen as both caring and capable, and small, generous habits build the
// reputation and network that open doors. All wording here is original.
// House style: plain, specific sentences. No em dashes.

export type ModuleId = "value" | "contribution" | "warmth" | "visible" | "connect" | "ask" | "grounded";
export type Upcoming = "intro" | "networking" | "interview" | "difficult" | "request" | "none";

export interface CheckinResponses {
  comfortable: string;
  unfamiliar: string;
  uncomfortable: string;
  notright: string;
}

export interface Session {
  id: string;
  n: number;
  moduleId: ModuleId;
  title: string;
  lesson: string;
  quick: string;
  familiar: string;
  another: string;
  reflection: string;
  starter: string;
  followUp: string;
  action: string;
  smaller: string;
  alternative: string;
  checkin: CheckinResponses;
  savePrompt: string;
  completion: string;
  upcoming?: Upcoming[];
}

export interface Module {
  id: ModuleId;
  n: number;
  title: string;
  practiceLabel: string;
  description: string;
}

export const modules: Module[] = [
  { id: "value", n: 1, title: "Know What You Bring", practiceLabel: "Knowing what I bring", description: "Respect is something other people give you. Get clear on what you want them to see." },
  { id: "contribution", n: 2, title: "Own Your Wins", practiceLabel: "Owning my wins", description: "Talk about your results in a way that earns respect, and share credit without erasing yourself." },
  { id: "warmth", n: 3, title: "Be Liked and Respected", practiceLabel: "Being liked and respected", description: "The women who get ahead are seen as both caring and capable. Show both, in ways that feel like you." },
  { id: "visible", n: 4, title: "Become More Visible", practiceLabel: "Becoming more visible", description: "Make sure the right people see your work, in meetings and online." },
  { id: "connect", n: 5, title: "Build Your Network", practiceLabel: "Building my network", description: "Grow relationships through small acts of generosity, and reconnect with people who already know your work." },
  { id: "ask", n: 6, title: "Ask with Confidence", practiceLabel: "Asking with confidence", description: "Ask plainly for what you want, back it up, and ask others to speak up for you." },
  { id: "grounded", n: 7, title: "Stay Grounded", practiceLabel: "Staying grounded through setbacks", description: "Handle setbacks and unfair moments with judgment, and keep your momentum." },
];

const defaultNotRight =
  "You know your situation best. You can keep this reflection private, choose another practice, or try a different session.";

export const sessions: Session[] = [
  // Module 1: Know What You Bring
  {
    id: "s1", n: 1, moduleId: "value", title: "Respect is something others give you",
    lesson: "At work, your standing isn't something you can declare. It lives in what other people think of you, and they build that view from what they actually see: how you show up, what you deliver, and how you treat them. That can feel unfair, but it also means you have more influence than you might think. You can't control every judgment, yet you can shape the evidence people use to make it. The first step is deciding what you want to be known for.",
    quick: "Your reputation lives in other people's minds, built from what they see you do. Decide what you want to be known for.",
    familiar: "\"I keep my head down and assume good work will get noticed eventually.\"",
    another: "\"I want to be known as the person who can take a messy problem and make it workable. I'm going to make sure people see that.\"",
    reflection: "What do you want the people you work with to know you for?",
    starter: "I want to be known as someone who…",
    followUp: "Based on what they've actually seen, what do they probably think of you today?",
    action: "Write one sentence about the reputation you want, and one thing you'll do this week that supports it.",
    smaller: "Write three words you'd like a colleague to use when describing you.",
    alternative: "Ask a trusted colleague what they would tell someone about working with you, and write down what they say.",
    checkin: {
      comfortable: "Keep this sentence close. It helps you decide what's worth letting people see.",
      unfamiliar: "Thinking about how others see you can feel calculating at first. It's simply paying attention to how respect works.",
      uncomfortable: "You don't need to change anything yet. Knowing the gap between how you're seen and how you want to be seen is useful on its own.",
      notright: defaultNotRight,
    },
    savePrompt: "Would you like to keep this as a strength you recognize?",
    completion: "You decided what you want to be known for.",
    upcoming: ["intro", "interview", "networking"],
  },
  {
    id: "s2", n: 2, moduleId: "value", title: "Show what changed because of you",
    lesson: "A list of tasks tells people you were busy. A clear result tells them you were effective, and effectiveness is what earns respect. When you describe your work, connect what you did to what it changed: time saved, a client kept, a decision made easier, a risk avoided. The effect doesn't need to be dramatic or measured in dollars. It needs to be specific and true, so the person listening can picture it.",
    quick: "Tasks show effort. Results show capability. Connect one thing you did to what it changed.",
    familiar: "\"I updated the onboarding documents.\"",
    another: "\"I rewrote the onboarding documents, and new hires stopped needing extra meetings in their first week.\"",
    reflection: "What became easier, clearer, faster, or safer because of something you did?",
    starter: "Because I…, the team was able to…",
    followUp: "Who noticed the difference, even informally?",
    action: "Write one sentence in the form: \"I did ___, which meant ___.\"",
    smaller: "Write down one action and the person or team it helped.",
    alternative: "Think of a problem that no longer exists, and write down what you did to solve it.",
    checkin: {
      comfortable: "This is a pattern you can reuse in updates, reviews, and interviews.",
      unfamiliar: "Linking actions to results gets easier the more examples you collect.",
      uncomfortable: "If you're unsure how big the effect was, say it modestly: \"helped reduce\" rather than \"eliminated.\" Accurate is enough.",
      notright: defaultNotRight,
    },
    savePrompt: "Would you like to save this as a contribution you own?",
    completion: "You connected your work to what it made possible.",
    upcoming: ["interview", "request"],
  },
  {
    id: "s3", n: 3, moduleId: "value", title: "Take your strengths with you",
    lesson: "In a transition it can feel as if your credibility stayed behind with your old title. It didn't. Judgment, steadiness under pressure, and the ability to earn trust quickly all move with you from role to role. The work is translating them into language a new audience understands, so they don't have to guess how your experience applies to them. Someone hiring in a new field will rarely make that leap for you.",
    quick: "Your strengths aren't tied to a title. Describe one in words a new audience would understand.",
    familiar: "\"I was a school administrator, so I'm not sure how that translates.\"",
    another: "\"I coordinate competing priorities across a lot of people and keep things moving when plans change.\"",
    reflection: "Which strength will still be yours even if your role or field changes?",
    starter: "Wherever I work, I'll still be someone who…",
    followUp: "Where could that strength be valuable in the role you're moving toward?",
    action: "Describe that strength in one sentence without mentioning your former title.",
    smaller: "Write three verbs that describe what you actually did in your last role.",
    alternative: "Write down a setting outside of work, such as volunteering, caregiving, or your community, where you used the same strength.",
    checkin: {
      comfortable: "This description travels well. Use it in introductions and conversations about what's next.",
      unfamiliar: "Translating your experience takes a few drafts. You can revise it as your direction gets clearer.",
      uncomfortable: "It's fine if the link to your next step isn't clear yet. Naming the strength comes first.",
      notright: defaultNotRight,
    },
    savePrompt: "Would you like to keep this as a strength you recognize?",
    completion: "You found something that comes with you into what's next.",
    upcoming: ["intro", "networking", "interview"],
  },
  // Module 2: Own Your Wins
  {
    id: "s4", n: 4, moduleId: "contribution", title: "Credit yourself and thank others",
    lesson: "Many women describe every win as a team effort, and often it was. The trouble starts when your own role disappears from the story entirely. People who name their part while openly thanking the people who helped tend to come across as both capable and generous, which is exactly the combination that earns respect. You don't have to choose between modesty and credit. You can say what you did and who helped you in the same breath.",
    quick: "Naming your part and thanking others work well together. Say both in one breath.",
    familiar: "\"We somehow got the new process launched.\"",
    another: "\"I led the rollout of the new process, and I couldn't have done it without Priya's work on the training materials.\"",
    reflection: "What is one accomplishment you usually describe only as \"we\"?",
    starter: "Our team…",
    followUp: "What did you personally lead, decide, create, or solve?",
    action: "Write it in two parts: \"I ___. I'm grateful to ___ for ___.\" Then say it aloud.",
    smaller: "Finish this sentence privately: \"My part was…\"",
    alternative: "Recall a compliment about your work and write down the contribution that person noticed.",
    checkin: {
      comfortable: "Keep this example. It's what clear, generous credit sounds like.",
      unfamiliar: "New wording can feel odd even when it's accurate. Practice it privately before you use it.",
      uncomfortable: "Check the facts and adjust anything that overstates your role. A smaller, true version works well.",
      notright: defaultNotRight,
    },
    savePrompt: "Would you like to keep this as evidence of your contribution?",
    completion: "You claimed your part and gave thanks at the same time.",
    upcoming: ["interview", "request"],
  },
  {
    id: "s5", n: 5, moduleId: "contribution", title: "Let a compliment land",
    lesson: "When someone praises your work, brushing it off can feel modest. To the other person it can sound like you're telling them they misjudged. Accepting a compliment respects both their judgment and your effort, and it makes it more likely they'll say something positive about you again, sometimes to people who matter. A simple thank-you is a complete answer. If the credit is genuinely shared, say so after you've accepted it, not instead of it.",
    quick: "Accepting praise respects the person who offered it. Try \"Thank you\" and a pause.",
    familiar: "\"Oh, it wasn't a big deal. I just threw it together.\"",
    another: "\"Thank you. I put real thought into it, so I'm glad it was useful.\"",
    reflection: "What do you usually say when someone recognizes your work?",
    starter: "When someone compliments me, I usually…",
    followUp: "What do you worry might happen if you simply said thank you?",
    action: "The next time someone offers sincere praise, say \"Thank you\" and pause before adding anything.",
    smaller: "Say \"Thank you, I appreciate that\" aloud once today, on your own.",
    alternative: "Reread a kind message you've received about your work and write one sentence about what it got right.",
    checkin: {
      comfortable: "That's a quiet, confident habit. It also makes it easier for people to praise you again.",
      unfamiliar: "The pause after a compliment can feel long. It's much shorter to the other person than it feels to you.",
      uncomfortable: "You don't have to agree with every compliment. \"Thank you\" only acknowledges that it was offered.",
      notright: "If a compliment feels insincere or loaded, you don't owe it warmth. Use your judgment, and choose another practice if this doesn't fit.",
    },
    savePrompt: "Would you like to save a sentence you want to practice?",
    completion: "You let recognition stay where it was offered.",
    upcoming: ["networking", "intro"],
  },
  {
    id: "s6", n: 6, moduleId: "contribution", title: "Make \"How's it going?\" count",
    lesson: "Small talk is one of the easiest places to let people know what you're working on, and most of us waste it. \"Busy\" or \"Fine, you?\" ends the conversation. A short, specific, upbeat answer gives the other person something to be curious about, and it lets you share your work without it ever feeling like a pitch. Have one ready for the next hallway chat, coffee line, or the first minute of a video call.",
    quick: "Replace \"busy\" with one specific, upbeat sentence about your work. Have it ready.",
    familiar: "\"Oh, you know, busy. Same as always.\"",
    another: "\"Good! I'm wrapping up the vendor review, and it looks like we can cut onboarding time in half.\"",
    reflection: "What are you working on right now that someone might find interesting?",
    starter: "Right now I'm working on…",
    followUp: "What one detail would make someone want to ask a follow-up question?",
    action: "Write a one-sentence answer to \"How's it going?\" and use it the next time someone asks.",
    smaller: "Write the answer and say it aloud once.",
    alternative: "The next time you hear yourself say \"busy,\" add one specific sentence about what you're doing.",
    checkin: {
      comfortable: "A ready answer turns ordinary moments into openings. Refresh it whenever your work changes.",
      unfamiliar: "Sharing a real detail in small talk can feel like too much at first. Most people welcome it.",
      uncomfortable: "Keep it light and short. One detail is plenty.",
      notright: defaultNotRight,
    },
    savePrompt: "Would you like to save a sentence you want to practice?",
    completion: "You turned small talk into an opening.",
    upcoming: ["networking", "intro"],
  },
  // Module 3: Be Liked and Respected
  {
    id: "s7", n: 7, moduleId: "warmth", title: "Liked and respected at the same time",
    lesson: "Women are often told, directly or not, to choose: be warm and risk not being taken seriously, or be tough and risk not being liked. Research on how people earn respect at work points somewhere else. The people who rise are usually seen as both caring and capable. Warmth shows in curiosity, listening, and generosity. Capability shows in preparation, clear judgment, and follow-through. You probably already do both. This session is about noticing where.",
    quick: "The people who get ahead are seen as both caring and capable. Name one way you show each.",
    familiar: "\"I try not to be too friendly at work, or people won't take me seriously.\"",
    another: "\"I ask people how they're really doing, and I come to meetings with a clear recommendation.\"",
    reflection: "When have you been both warm and capable in the same moment?",
    starter: "I remember a time when…",
    followUp: "What did the people around you seem to appreciate?",
    action: "Name one thing you do that shows you care and one that shows you're capable.",
    smaller: "Write one behavior, either warm or capable, that you already do well.",
    alternative: "Think of someone you admire for being both, and write down one thing they do that you could adapt.",
    checkin: {
      comfortable: "You have a working example. Come back to it when you feel pulled to pick one side.",
      unfamiliar: "Seeing both qualities in yourself can take getting used to. They were there before you named them.",
      uncomfortable: "Some workplaces do penalize women for one or the other. Noticing that isn't a personal failing. It's useful information.",
      notright: defaultNotRight,
    },
    savePrompt: "Would you like to save a personal insight?",
    completion: "You saw yourself as both warm and capable.",
    upcoming: ["intro", "networking"],
  },
  {
    id: "s8", n: 8, moduleId: "warmth", title: "Clear is kind",
    lesson: "Softening a request can feel considerate, but vagueness usually shifts the work onto the other person, who now has to guess what you need. Being specific is a form of respect for their time, and it signals that you know what you're doing. Your warmth can come through in your tone, your timing, and your thanks, rather than in leaving the important part unsaid.",
    quick: "Vague requests make others guess. Make one specific, and keep your tone warm.",
    familiar: "\"Whenever you get a chance, maybe we could possibly look at the timeline?\"",
    another: "\"Could we review the timeline on Thursday? I'm concerned the second phase is too tight.\"",
    reflection: "What have you been keeping vague because you want to sound considerate?",
    starter: "I've been hinting at…",
    followUp: "What would the other person need to know to respond well?",
    action: "Make one specific, courteous request in a real conversation or message.",
    smaller: "Draft the specific version privately without sending it.",
    alternative: "Rewrite one vague sentence from a recent email and keep it for next time.",
    checkin: {
      comfortable: "Clear and kind is a combination people remember. Keep using it.",
      unfamiliar: "Directness can feel abrupt when you're used to cushioning. A warm tone does the cushioning for you.",
      uncomfortable: "If the stakes feel high, try the specific version with someone you trust first.",
      notright: "Some situations really do call for more care or better timing. Trust your read, and choose another practice if needed.",
    },
    savePrompt: "Would you like to save a sentence you want to practice?",
    completion: "You chose clarity as a kindness.",
    upcoming: ["difficult", "request"],
  },
  {
    id: "s9", n: 9, moduleId: "warmth", title: "Introduce yourself with something to remember",
    lesson: "An introduction is short, but it sets the first impression people carry away. Many of us list a title and stop, or hand the attention back as quickly as possible. A strong introduction includes one thing you're good at and one genuine point of connection, such as a shared interest, a real question, or something you admire about their work. It doesn't need to be polished. It needs to give the other person something to respond to.",
    quick: "A good introduction offers one strength and one genuine point of connection. Draft yours.",
    familiar: "\"Hi, I'm Dana. I'm kind of between things right now.\"",
    another: "\"Hi, I'm Dana. I've spent ten years helping teams through big changes, and I'm curious how your group handled the merger.\"",
    reflection: "What do you want someone to understand about what you bring?",
    starter: "I'd like people to know that I…",
    followUp: "What question or shared interest could you add to invite a response?",
    action: "Write a two-sentence introduction with one strength and one point of connection, and say it aloud.",
    smaller: "Write only the first sentence of your introduction.",
    alternative: "Write how a friend who admires your work would introduce you.",
    checkin: {
      comfortable: "This introduction is ready to use. Adjust it for each room.",
      unfamiliar: "Introductions get easier with repetition. Saying it aloud a few times helps it sound like you.",
      uncomfortable: "Try a shorter version first. One specific detail beats none.",
      notright: defaultNotRight,
    },
    savePrompt: "Would you like to save your introduction as words you want to practice?",
    completion: "You gave people something real to remember you by.",
    upcoming: ["intro", "networking", "interview"],
  },
  // Module 4: Become More Visible
  {
    id: "s10", n: 10, moduleId: "visible", title: "Let your work be seen",
    lesson: "Good work rarely speaks for itself, because the people who decide on promotions and projects are usually not in the room when it happens. They form their impressions from what you say, write, and share. A short, factual update isn't bragging. It's how decision makers learn what's happening and who is making it happen. Pick one recent contribution that someone relevant may not know about.",
    quick: "Decision makers can only value what they hear about. Share one factual update.",
    familiar: "Finishing the analysis and saying nothing, hoping your manager notices.",
    another: "\"Quick update: I finished the vendor analysis. One option saves us about two weeks. Happy to walk you through it.\"",
    reflection: "What have you done recently that someone relevant may not know about?",
    starter: "Something I did recently that others may not know about is…",
    followUp: "Who would benefit from knowing, and what's an appropriate way to tell them?",
    action: "Share a short, factual update about your work with someone who should know.",
    smaller: "Draft the update in three sentences or fewer without sending it.",
    alternative: "Add the contribution to a running list you can draw from in your next one-on-one.",
    checkin: {
      comfortable: "Regular, factual updates build visibility without fanfare. Make it a habit.",
      unfamiliar: "Visibility can feel like self-promotion until you see it as information others need.",
      uncomfortable: "Start with a lower-stakes audience, such as a peer or mentor, before your manager or a wider group.",
      notright: "In some workplaces visibility carries real risk. Keep the update private for now and choose another practice.",
    },
    savePrompt: "Would you like to keep this as evidence of your contribution?",
    completion: "You made your work easier to see.",
    upcoming: ["networking", "request"],
  },
  {
    id: "s11", n: 11, moduleId: "visible", title: "Speak before the perfect sentence arrives",
    lesson: "Waiting for flawless wording often means the moment passes and someone else says something similar. Ideas don't need to be finished to be useful, and offering one early shows you're engaged and thinking. You can signal that a thought is still forming without apologizing for it. Choose a setting that feels manageable and contribute one idea before it feels polished.",
    quick: "Ideas don't need to be finished to be useful. Share one in a setting that feels manageable.",
    familiar: "\"Sorry, this is probably a dumb question, but…\"",
    another: "\"One idea I'm still working through: what if we tested this with one team first?\"",
    reflection: "What idea have you been waiting to polish before sharing?",
    starter: "An idea I've been holding onto is…",
    followUp: "What's the smallest version of it you could say out loud?",
    action: "Offer one idea in a meeting, a chat thread, or a conversation.",
    smaller: "Write the idea as one sentence and share it with one person you trust.",
    alternative: "Ask one genuine question in your next meeting instead of offering an idea.",
    checkin: {
      comfortable: "Speaking early keeps you part of the conversation. Keep giving yourself that room.",
      unfamiliar: "Unfinished ideas feel exposed at first. Most people hear them as engagement.",
      uncomfortable: "A smaller setting is a fine place to start. A one-on-one counts.",
      notright: defaultNotRight,
    },
    savePrompt: "Would you like to save a commitment?",
    completion: "You put an idea in the room before it was perfect.",
    upcoming: ["networking", "interview", "difficult"],
  },
  {
    id: "s12", n: 12, moduleId: "visible", title: "Share what you're learning, publicly",
    lesson: "A thoughtful post on LinkedIn or in a professional community reaches people you'd never run into at work: former colleagues, recruiters, and people in the field you want to move into. You don't need to be an expert or post often. A few lines about something you learned, a project you finished, or a colleague you want to congratulate keeps you visible and gives people an easy reason to get back in touch.",
    quick: "One thoughtful post keeps you visible to people you rarely see. Draft one.",
    familiar: "Scrolling LinkedIn for months without posting, because nothing feels important enough.",
    another: "\"Three things I learned leading our first remote onboarding: start earlier than you think, overcommunicate in week one, and pair every new hire with a peer. What would you add?\"",
    reflection: "What have you learned, finished, or noticed lately that others in your field might find useful?",
    starter: "Something I've learned recently is…",
    followUp: "Who would you most like to see this post?",
    action: "Write and publish a short post about something you learned, finished, or admire in a colleague's work.",
    smaller: "Draft the post and save it without publishing.",
    alternative: "Congratulate someone publicly on their work or new role, with one specific sentence about why.",
    checkin: {
      comfortable: "An occasional post keeps you in people's minds. Once or twice a month is plenty.",
      unfamiliar: "Posting about your work can feel exposed. Leading with what you learned, or with credit to others, keeps it generous.",
      uncomfortable: "Start by leaving a thoughtful comment on someone else's post. That's visibility too.",
      notright: "If public posting is risky in your situation, keep this private or choose another practice.",
    },
    savePrompt: "Would you like to save a commitment?",
    completion: "You made yourself visible beyond the room.",
    upcoming: ["networking", "intro"],
  },
  // Module 5: Build Your Network
  {
    id: "s13", n: 13, moduleId: "connect", title: "Give before you need anything",
    lesson: "The strongest networks are built in small moments, long before anyone needs a favor. Introducing two people who should know each other, sending an article that made you think of someone, or answering a question in your area of expertise each take a few minutes. They also show people you're capable and generous, and people remember that. Help on this scale is easy to keep up, and over time it adds up to a lot of goodwill.",
    quick: "Small acts of help build a network that's there when you need it. Do one today.",
    familiar: "\"I'll start networking once I'm actually looking for a job.\"",
    another: "\"Sam, meet Jordan. You're both rebuilding your onboarding programs, and I think you'd have a lot to compare notes on.\"",
    reflection: "Who in your world could use an introduction, a useful resource, or a bit of your expertise?",
    starter: "Someone who might appreciate a hand is…",
    followUp: "What could you offer them in five minutes or less?",
    action: "Do one small favor: make an introduction, share a useful link, or answer a question you know well.",
    smaller: "Write down three people and one small thing you could offer each.",
    alternative: "Offer a skill others on your team find hard, such as a tool, a process, or social media know-how.",
    checkin: {
      comfortable: "Keep a short list of people and ideas so this becomes a habit.",
      unfamiliar: "Offering help unprompted can feel forward. Keep it light and easy to ignore.",
      uncomfortable: "Choose something very small, like forwarding one article with a short note.",
      notright: defaultNotRight,
    },
    savePrompt: "Would you like to save this as an action you took?",
    completion: "You invested in a relationship before you needed it.",
    upcoming: ["networking"],
  },
  {
    id: "s14", n: 14, moduleId: "connect", title: "Reconnect with a former colleague",
    lesson: "The network you already have is usually worth more than the one you're trying to build. Former managers, teammates, and clients have seen your work firsthand, and most are glad to hear from you, even years later. You don't need an elaborate reason to get in touch. Mention how you know each other, share one line about what you're doing now, and ask a simple question. Plenty of good opportunities begin with a message like that.",
    quick: "People who've worked with you already trust your work. Send one a short note.",
    familiar: "\"I'm so sorry to bother you. I know you're incredibly busy, and you probably don't remember me, but…\"",
    another: "\"Hi Maya, it's been a while since we worked on the 2021 audit. I'm exploring roles in compliance now and would love to hear how things are going for you. Coffee sometime?\"",
    reflection: "Which former colleague, manager, or client have you lost touch with but would like to hear from?",
    starter: "Someone I've been meaning to reach out to is…",
    followUp: "How do you know each other, and what's one simple thing you could ask?",
    action: "Send a short message to a former colleague: how you know each other, what you're doing now, and one question.",
    smaller: "Write the message and save it as a draft.",
    alternative: "Comment on or congratulate something they've shared online as an easy way back into contact.",
    checkin: {
      comfortable: "A short, friendly note is easy to answer. Try one a month and watch your network come back to life.",
      unfamiliar: "Getting back in touch after a long gap can feel awkward. Most people are pleased to be remembered.",
      uncomfortable: "Start with someone you had a warm working relationship with.",
      notright: defaultNotRight,
    },
    savePrompt: "Would you like to save the message as words you want to practice?",
    completion: "You reopened a door with someone who knows your work.",
    upcoming: ["networking"],
  },
  {
    id: "s15", n: 15, moduleId: "connect", title: "Tell people what you're moving toward",
    lesson: "People who know your past work may have no idea what you want next, so they can't send opportunities your way or mention your name when it counts. Telling them doesn't require a finished plan. One sentence about what you're exploring gives them a way to help, and many people are glad to be asked. It also makes it easy for them to recommend you, which carries more weight than anything you could say about yourself.",
    quick: "Others can only recommend you for what they know you want. Tell one person your direction.",
    familiar: "Catching up with a former colleague and only talking about the past.",
    another: "\"I'm exploring a move into product operations. If you hear of a team thinking about that, I'd love to know.\"",
    reflection: "Who knows your past work but may not know what you want next?",
    starter: "Someone who knows my work well is…",
    followUp: "How would you describe your direction in one sentence, even if it's still forming?",
    action: "Tell one person where you're heading and what kind of opportunity you'd welcome.",
    smaller: "Write your one-sentence direction and keep it ready.",
    alternative: "Update your LinkedIn headline or About section to reflect what you're moving toward.",
    checkin: {
      comfortable: "Saying your direction out loud makes it easier for others to remember it and help.",
      unfamiliar: "A direction can be tentative and still worth sharing. You can update it anytime.",
      uncomfortable: "If you're not ready to share widely, telling one trusted person is enough.",
      notright: defaultNotRight,
    },
    savePrompt: "Would you like to save a commitment?",
    completion: "You let someone see where you're heading.",
    upcoming: ["networking", "intro"],
  },
  // Module 6: Ask with Confidence
  {
    id: "s16", n: 16, moduleId: "ask", title: "Name what you want",
    lesson: "Many women wait for the right opportunity, raise, or recognition to be offered. Sometimes it is. More often, the people who could say yes simply don't know what you want. Naming it plainly comes first, before the context, the justification, or the reassurance. A clear request gives the other person something concrete to consider, and it shows you take your own goals seriously.",
    quick: "People can't offer what they don't know you want. Write your request plainly first.",
    familiar: "\"I was wondering if maybe at some point there might be room for me to get involved in more strategic work?\"",
    another: "\"I'd like to lead planning for next year's roadmap.\"",
    reflection: "What opportunity, support, or recognition have you been hoping someone will offer?",
    starter: "I've been hoping someone would offer…",
    followUp: "Who is the right person to ask?",
    action: "Write the request in one plain sentence before adding any context.",
    smaller: "Finish this sentence privately: \"What I want is…\"",
    alternative: "Write down one thing you'd like help with this week, however small.",
    checkin: {
      comfortable: "A plain request is a strong start. Keep it close as you plan the conversation.",
      unfamiliar: "Saying what you want directly can feel exposed. The sentence can stay private until you're ready.",
      uncomfortable: "You don't have to ask today. Being clear about what you want is useful on its own.",
      notright: defaultNotRight,
    },
    savePrompt: "Would you like to save a sentence you want to practice?",
    completion: "You named what you want, plainly.",
    upcoming: ["request", "difficult"],
  },
  {
    id: "s17", n: 17, moduleId: "ask", title: "Make the case, then let them answer",
    lesson: "A request is easier to say yes to when it's tied to something real: a result you delivered, a need you've noticed, or a goal you share with the person you're asking. One or two accurate points carry more weight than a long list built from nerves. Once you've asked, stop talking. The silence that follows is where the other person thinks it over, and filling it usually means talking yourself down.",
    quick: "Back your request with one or two facts, then pause and let them answer.",
    familiar: "\"I know it's a lot to ask, and I'll understand if not, but I've been working really hard and…\"",
    another: "\"I've led client onboarding for a year, and we've cut setup time by a third. I'd like to take on the team lead role.\" (pause)",
    reflection: "What evidence supports your request?",
    starter: "This request makes sense because…",
    followUp: "What will you ask if they hesitate?",
    action: "Write your request with one supporting fact, then rehearse it aloud and end with a pause.",
    smaller: "List two facts that support your request.",
    alternative: "Look through My Evidence and pick one entry that supports a future request.",
    checkin: {
      comfortable: "A grounded request is easy to hear. You're ready to practice it for real.",
      unfamiliar: "Silence after asking can feel tense. It's usually where the other person is genuinely considering it.",
      uncomfortable: "If you're unsure your case is strong enough, a mentor or trusted peer can help you test it.",
      notright: defaultNotRight,
    },
    savePrompt: "Would you like to keep this as evidence of your contribution?",
    completion: "You made your case and left room for the answer.",
    upcoming: ["request", "interview", "difficult"],
  },
  {
    id: "s18", n: 18, moduleId: "ask", title: "Ask someone to speak up for you",
    lesson: "What other people say about you carries more weight than anything you say about yourself. The colleagues who already respect your work are often happy to say so, if they know it would help, but most never think to unless they're asked. A specific request makes it easy: name the person or the moment, and what you'd like them to mention. It's an ordinary professional ask, and you can return the favor.",
    quick: "Praise from others carries more weight. Ask one person to mention your work where it matters.",
    familiar: "Hoping a mentor will bring up your name in the promotion discussion without ever asking.",
    another: "\"You saw my work on the vendor project up close. If my name comes up for the operations lead role, would you be comfortable sharing what you saw?\"",
    reflection: "Who already respects your work and could mention it to someone who matters?",
    starter: "Someone who has seen my work up close is…",
    followUp: "Who would you like them to tell, and what specifically should they mention?",
    action: "Ask one person, specifically, to mention your work to someone or at a moment that matters.",
    smaller: "Write down who you'd ask and the one sentence you'd like them to say.",
    alternative: "Speak up for a colleague first: tell their manager about something they did well.",
    checkin: {
      comfortable: "A specific ask makes yes easy. Thank them afterward and keep them posted.",
      unfamiliar: "Asking someone to vouch for you can feel awkward. People who respect your work usually take it as a compliment.",
      uncomfortable: "Start with someone close, like a former manager or a peer who already cheers you on.",
      notright: defaultNotRight,
    },
    savePrompt: "Would you like to save a sentence you want to practice?",
    completion: "You asked someone to help your work be seen.",
    upcoming: ["request", "networking", "interview"],
  },
  // Module 7: Stay Grounded
  {
    id: "s19", n: 19, moduleId: "grounded", title: "A setback is an event",
    lesson: "When something goes wrong, whether it's a rejection, a cool response, or an awkward meeting, it's easy to jump straight to meaning: \"I'm not good enough,\" or \"I'll never get there.\" Separating what happened from the story you're telling about it creates room to respond well. Facts are what a camera would record. Interpretations are everything you add. Some interpretations are accurate, and others are worth questioning.",
    quick: "Separate what happened from the meaning you're adding. Sort one recent setback.",
    familiar: "\"They didn't call me back. I clearly bombed the interview.\"",
    another: "\"They haven't called back after a week. I don't know why yet. I'll follow up once.\"",
    reflection: "What happened, and what meaning are you adding to it?",
    starter: "What happened was… and what I've been telling myself is…",
    followUp: "What's one other possible explanation?",
    action: "Write two short lists: what actually happened, and what you've concluded from it.",
    smaller: "Write one fact and one interpretation.",
    alternative: "Tell a trusted person only the facts, and ask what they notice.",
    checkin: {
      comfortable: "Sorting facts from stories is a steadying skill. Come back to it whenever you need it.",
      unfamiliar: "Interpretations often feel like facts at first. Noticing the difference is the work.",
      uncomfortable: "Some setbacks hurt no matter how you frame them. You're allowed to feel that too.",
      notright: "If the setback involved unfair treatment, that's real and not just an interpretation. Consider the next session, or reach out for support.",
    },
    savePrompt: "Would you like to save a personal insight?",
    completion: "You put some space between what happened and what it means.",
    upcoming: ["difficult", "interview"],
  },
  {
    id: "s20", n: 20, moduleId: "grounded", title: "Discomfort or a boundary?",
    lesson: "Not every hesitation is fear to push through. Sometimes discomfort is simply what a new habit feels like. Sometimes it's a sign you need more information, more support, or a boundary. Bias, exclusion, and disrespect are real, and no amount of confidence building should require you to ignore them. Good judgment means asking what the situation actually calls for, then choosing the response that protects both your goals and you.",
    quick: "Hesitation can mean practice, a need for information or support, or a boundary. Decide which fits.",
    familiar: "\"I should keep pushing myself to go to those meetings, even though I'm talked over every time.\"",
    another: "\"I'll keep going, and I'll ask the facilitator to make sure everyone gets to finish their point.\"",
    reflection: "Does this situation call for practice, more information, support, or a boundary?",
    starter: "The situation I'm thinking about is…",
    followUp: "What would a wise friend who knows the context suggest?",
    action: "Choose the response that fits: keep practicing, gather information, find support, or set a boundary.",
    smaller: "Name which of the four the situation calls for, without deciding next steps yet.",
    alternative: "Write down one person or resource that could support you in this situation.",
    checkin: {
      comfortable: "You're using judgment, not just willpower. That's grounded confidence.",
      unfamiliar: "Telling discomfort apart from a real problem takes reflection. You don't have to get it perfect.",
      uncomfortable: "If this involves harm or discrimination, consider support from a trusted person, HR, or a professional resource.",
      notright: "Your read on your situation matters most. Choose whatever response protects you and your goals.",
    },
    savePrompt: "Would you like to save a personal insight?",
    completion: "You chose a response that fits what's real.",
    upcoming: ["difficult"],
  },
  {
    id: "s21", n: 21, moduleId: "grounded", title: "Notice who you're becoming",
    lesson: "Growth is hard to see from the inside. Things that once felt out of reach quietly become things you just do. Looking back at specific moments, like a request you made, a post you shared, or a colleague you reconnected with, shows you change that has really happened. It also helps you choose what's next. A good next step is a week of small moves: meet a few new people, do a few small favors, and tell a few colleagues something specific you admire about their work.",
    quick: "Growth is hard to see from the inside. Notice one thing you did that you once would have avoided.",
    familiar: "\"I haven't really changed. I still get nervous.\"",
    another: "\"I still get nervous, and last week I shared my idea in the planning meeting anyway.\"",
    reflection: "What have you done recently that an earlier version of you might have avoided?",
    starter: "Recently, I…",
    followUp: "What would you like to practice next?",
    action: "Save one example of your growth, then plan a week of small moves: a few new conversations, a few small favors, a few sincere compliments.",
    smaller: "Write one word that describes how you've changed.",
    alternative: "Look back through My Evidence and choose one entry that shows growth.",
    checkin: {
      comfortable: "Recognizing your own growth is evidence too. Keep it close.",
      unfamiliar: "It can feel odd to give yourself credit for change. It still counts.",
      uncomfortable: "Growth isn't a straight line. One example is enough to start.",
      notright: defaultNotRight,
    },
    savePrompt: "Would you like to save this as an action you took?",
    completion: "You noticed who you're becoming.",
    upcoming: ["none"],
  },
];

export const sessionById = (id: string) => sessions.find((s) => s.id === id);
export const moduleById = (id: ModuleId) => modules.find((m) => m.id === id)!;
export const sessionsInModule = (id: ModuleId) => sessions.filter((s) => s.moduleId === id);

export const upcomingOptions: { id: Upcoming; label: string }[] = [
  { id: "intro", label: "An introduction" },
  { id: "networking", label: "A networking conversation" },
  { id: "interview", label: "An interview" },
  { id: "difficult", label: "A difficult conversation" },
  { id: "request", label: "A request or negotiation" },
  { id: "none", label: "Nothing specific" },
];
