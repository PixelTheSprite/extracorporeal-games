# Doomsday Race — TCG Prototype Spec

Nov 2, 2026 · @M

## How to use this doc

This spec is a working draft: your rules are kept, gaps are filled with proposed defaults, and open choices are flagged for you.

- **Decide:** marks a question only you can answer. Answer it in place and delete the marker.
- *(proposed)* marks a default I filled in. Keep it, change it, or delete it.
- Anything unmarked is from your original draft.

## Concept

Two villains race to power a doomsday device; a euro-style worker-placement engine builder told through trading cards.

**Pitch:** Two villains, but only one can destroy the world. Will you be first?

**Working title:** Doomsday Race *(proposed)*. **Decide:** final title.

**Design pillars** *(proposed)*:

1. **Euro-game heart.** Every turn is a placement puzzle: which machines get your limited minions, and what you give up by choosing.
2. **A board that rewards arrangement.** Where a contraption sits matters as much as what it does.
3. **A visible race.** Both doomsday meters are always on screen, so every turn carries tension.

**App-native hooks** *(proposed)*: mechanics a paper TCG can't do easily, such as exact hidden-resource tracking, animated combos that resolve automatically, and charge meters that sabotage cards can drain. **Decide:** add a hook that's unique to this game, such as contraptions that upgrade after being worked a set number of times.

**Platform:** iOS first. The prototype is a browser app tuned for iPhone Safari in landscape and installable to the home screen. A native Swift/SpriteKit port is a later phase.

## Lessons from past projects

Write these out here rather than attaching old projects, so every build conversation has them without loading extra files.

**Decide:** list 3 to 5 lessons in the form *project: what went wrong → rule for this build*. For example:

- &#91;Project\]: \[problem\] → \[rule\]
- &#91;Project\]: \[problem\] → \[rule\]
- &#91;Project\]: \[problem\] → \[rule\]

## Scope for v1

v1 is one complete match loop: you against an AI, Tesla vs. Edison, start to finish.

**In:**

- Single-player against an AI opponent
- Two fixed 40-card decks (Tesla, Edison); pick either side
- Full rules, board, animations and combos
- Save and resume a match in progress *(proposed)*
- A short how-to-play screen *(proposed)*

**Out:** trading, packs or any card economy, accounts, multiplayer, collection screens.

**Decide:** is a simple deck editor in or out of v1? *(proposed: out)*

## Card types and deck composition

Each 40-card deck uses about 16 unique cards in 2 to 3 copies each, which keeps the sprite workload manageable.

| Type | What it does | Copies per deck *(proposed)* |
| --- | --- | --- |
| Doomsday device | Win condition. One starts in play; extras can replace it. | 3 (1 starts in play, 2 in deck) |
| Contraption | Machine placed on your grid; a minion working it produces resources. | 26 |
| Distraction | Original superhero who interferes with your rival's board, resources or minions. | 8 |
| Worker | Recruits a permanent extra minion when played. | 3 |

Minions themselves are tokens, not cards. You start with 2.

**Recruiting:** both routes exist. Worker cards are the cheap route; buying a minion for 4 resources is the reliable one.

**Copy limit:** at most 3 copies of any one card.

## The board, grid and adjacency

The board is one shared grid, 3 columns by 4 rows: each player owns their back row, and the two center rows are shared Public Works.

```text
        [ Rival's doomsday slot ]
Row 4   R   R   R    rival's back row (private)
Row 3   P   P   P    Public Works (shared)
Row 2   P   P   P    Public Works (shared)
Row 1   Y   Y   Y    your back row (private)
        [ Your doomsday slot ]
```

- **Back row:** only its owner builds and works there.
- **Public Works:** either player may build a contraption there; whoever builds it owns it. Either player may work any Public Works contraption. When you work a rival's contraption, its owner gets 1 of its output.
- **One minion per contraption.**
- **Doomsday slot:** a dedicated slot beside the grid, outside it.
- **Adjacency:** orthogonal only.
- **Resonance:** when two adjacent contraptions are both worked this turn and share an output resource, each produces +1 of that resource.
- **Card combos:** some cards name a partner type, for example "+2 Electricity if adjacent to a Coil." Every combo plays the sprite interaction animation.

**Combos across owners:** Resonance and card combos count between your card and a rival's adjacent card. Each card's owner collects that card's bonus.

**Scrapping:** during Build you may scrap your own contraption for free to open its slot; the card goes to your discard.

## Setup and turn structure

A turn runs draw, build, place, collect, charge, end; every step below is fixed so the engine never has to guess.

**Setup:**

1. Each player chooses one of their 3 doomsday devices and puts it in the doomsday slot; the other 2 shuffle into the deck.
2. Shuffle; draw 5 cards. One free mulligan: shuffle the hand back and draw 5 again *(proposed)*.
3. Take 2 minion tokens.
4. Take starting resources: 2 of your deck's primary resource *(proposed; prevents a dead first turn)*.
5. Random first player. The second player starts with 1 extra resource of their choice *(proposed)*.

**Each turn:**

1. **Doomsday check and draw: if your device is fully charged, it fires and you win; otherwise draw 1 card (mandatory)** *(proposed)*.
2. **Build:** play contraptions, distractions and worker cards, paying their costs.
3. **Place** minions on your back-row contraptions or any Public Works contraption. You may burn cards for extra minions here.
4. **Collect** resources from every worked contraption, including combo bonuses.
5. **Charge:** move any resources into your doomsday device.
6. **End:** minions return; discard down to the hand limit.

**Turn rules:**

- Play any number of cards in Build, as long as you can pay for them.
- A contraption can't be worked the turn it's played.
- Hand limit is 7.
- Empty deck: shuffle your discard back in, and lose 1 minion for the rest of the game.

## Resources and economy

Five resources, with MacGuffin kept scarce so both players fight over it; target match length is 12 to 15 turns.

| Resource | Role *(proposed)* | Main producer |
| --- | --- | --- |
| Electricity | Common; core of both decks | Both |
| Organic matter | Common; recruiting and Edison's engine | Edison |
| Magic | Uncommon; Tesla's high-yield machines | Tesla |
| Spirit essence | Uncommon; doomsday fuel | Tesla, some Edison |
| MacGuffin | Scarce; every doomsday device needs 3 to 5 | About 4 cards per deck |

**Your ranges:** contraptions produce 1 to 3 of 1 to 2 resource types, and cost 0 to 9 total across 1 to 5 types.

**Curve** *(proposed)*: each deck has at least 6 contraptions costing 0 to 1, about 12 costing 2 to 4, and about 8 costing 5 to 9.

**Pacing math** *(proposed, to tune in playtesting)*: income starts near 4 per turn and grows to about 8 by turn 8. A doomsday device costing about 36 total then lands around turn 12 to 15.

**Carryover cap:** 10 per resource type at end of turn.

This economy is a first pass, expected to change in playtesting; every number lives in the config object.

## Minions and worker placement

Minions are your action budget: 2 at the start, more by recruiting or by burning cards.

- **Placement:** one minion per contraption *(proposed)*; all minions return at end of turn.
- **Recruit (permanent):** pay 4 resources of any types for 1 minion *(proposed)*, or play a worker card.
- **Burn (temporary):** discard 2 cards from hand for 1 extra minion this turn only *(proposed)*.
- **Cap:** 6 minions total *(proposed)*.

Burned minions are always temporary, so burning stays a tactical choice rather than a snowball.

## Doomsday devices and winning

A fully charged doomsday device fires at the start of your next turn and wins the game; charging is incremental and visible to both players.

- **Cost:** each device lists a cost per resource type, about 36 total including 3 to 5 MacGuffin *(proposed)*. Example: 12 Electricity, 10 Magic, 10 Spirit, 4 MacGuffin.
- **Charging:** in the Charge step, move any amount of matching resources onto the device. Progress shows as a meter per resource type.
- **Passive ability:** each device has one small ongoing effect, for example "Your Coils produce +1 Electricity."
- **Swapping:** play a device from hand to replace your current one. It keeps half the old device's charge, rounded down, in matching types *(proposed)*.
- **Sabotage:** some distractions drain charge, so a near-finished device is a target.

**Firing:** a full device fires at the start of your next turn, which gives the rival one turn to respond.

**Defense:** some contraptions and distractions can protect a device with **Shield**, which cancels the next Sabotage or Drain aimed at it *(proposed)*. **Decide:** whether Shield lasts one round or until it absorbs a hit.

## Distractions (superheroes)

Distractions are original superheroes you send at your rival; each uses one or two actions from a fixed vocabulary.

| Action | Effect *(proposed)* |
| --- | --- |
| Steal | Take up to 2 of one resource from the rival |
| Drain | Rival discards up to 3 resources of one type |
| Jam | Target contraption can't be worked on the rival's next turn |
| Swap | Swap two contraptions on the rival's grid, breaking combos |
| Bounce | Return a rival contraption to their hand |
| Sabotage | Remove up to 3 charge from the rival's doomsday device |
| Capture | Rival has one fewer minion on their next turn |
| Shield | Protect your own doomsday device: cancel the next Sabotage or Drain aimed at it |

- **Duration:** one-shot by default. Cards with **Patrol** stay on a target for 2 turns *(proposed)*.
- **Timing:** played only on your own turn in v1; no counters or responses *(proposed)*.
- **Heroes are original characters.** No existing comic or film heroes. **Roster: Gaslight Avenger, Telegraph Kid, Lady Lumen, Banjo Slam, Conductor, Texas Sparks and Riveteer, each designed to look the way their name suggests**.

## Card data schema and effect vocabulary

Every card is plain data, and effects are built from a shared vocabulary, so new cards never need new engine code.

```json
{
  "id": "tesla_coil",
  "name": "Tesla Coil",
  "deck": "tesla",
  "type": "contraption", "rarity": "uncommon",
  "cost": { "electricity": 1, "magic": 1 },
  "produces": { "electricity": 2 },
  "tags": ["coil"],
  "effects": [
    { "trigger": "onWork", "condition": { "adjacentTag": "coil" },
      "action": "gain", "params": { "electricity": 1 } }
  ],
  "rulesText": "+1 Electricity if adjacent to another Coil.",
  "flavor": "Thunder, on demand.",
  "sprite": "tesla_coil",
  "copies": 3
}
```

**Vocabulary** *(proposed starting set)*:

- **Triggers:** onPlay, onWork, onTurnStart, onTurnEnd, onCombo
- **Conditions:** adjacentTag, adjacentType, resourceAtLeast, minionsAtLeast, deviceChargeAtLeast
- **Actions:** gain, spend, steal, drain, jam, swap, bounce, sabotage, capture, draw, recruit, chargeDevice, shield

Rules text is written by hand per card, so it reads naturally; the effects array is what the engine runs.

## Decks: Tesla and Edison

Tesla goes tall with few workers and powerful combos; Edison goes wide with a big workforce and disruptive tricks.

|  | Tesla *(proposed)* | Edison *(proposed)* |
| --- | --- | --- |
| Play style | Tall: fewer, expensive, high-yield machines | Wide: many cheap, reliable machines |
| Primary resources | Electricity, Magic, Spirit | Electricity, Organic, MacGuffin |
| Minions | Few; worker cards are rare | Many; cheap recruiting via the Menlo Park workforce |
| Combos | Strong adjacency chains (Coils, Pylons) | Small, steady bonuses |
| Distraction style | Jam, Sabotage | Steal, Swap (the patent-fight angle) |
| Doomsday devices | Earthquake Oscillator, Teleforce Death Ray, World Tower | Spirit Phone, Grid of Ten Thousand Bulbs, Kinetoscope of Ruin |
| Sample contraptions | Tesla Coil, Wireless Pylon, Induction Motor, Pigeon Loft | Dynamo, Phonograph, Quadruplex Telegraph, Patent Office |
| Palette | T3 Storm Steel: grey-blue with a yellow spark accent | E2 Sepia Reel: sepia with a red accent |

The Spirit Phone is a real hook: Edison publicly floated building a device to talk with the dead.

### Draft card lists

A first pass for you to iterate on: 18 unique Tesla cards and 17 unique Edison cards, each deck exactly 40 cards and matching the curve, rarity and MacGuffin targets above.

**Key:** E = Electricity, O = Organic matter, M = Magic, S = Spirit essence, Mac = MacGuffin. Both decks start with 2 E.

#### Tesla (40 cards)

Heroes: Gaslight Avenger, Conductor, Riveteer, Lady Lumen.

| Card | Type | Rarity | Copies | Cost | Produces | Effect |
| --- | --- | --- | --- | --- | --- | --- |
| Earthquake Oscillator | Doomsday | Legendary | 1 | 14E 10M 8S 4Mac |  | Passive: Resonance gives your cards +2 instead of +1 |
| Teleforce Death Ray | Doomsday | Legendary | 1 | 16E 8M 8S 4Mac |  | Passive: your Coils produce +1 E |
| World Tower | Doomsday | Legendary | 1 | 12E 10M 10S 4Mac |  | Passive: when a rival works your contraption, you get 2 of its output instead of 1 |
| Lab Assistant | Worker | Uncommon | 3 | 2E 1M |  | Recruit 1 permanent minion |
| Spark Gap | Contraption | Common | 3 | 0 | 1E |  |
| Pigeon Loft | Contraption | Common | 3 | 1E | 1O 1S |  |
| Tesla Coil | Contraption | Common | 3 | 1E 1M | 2E | Coil. +1 E if adjacent to another Coil |
| Induction Motor | Contraption | Common | 3 | 2E 1O | 1E 1M |  |
| Ether Lens | Contraption | Common | 3 | 2E 1S | 2M |  |
| Wireless Pylon | Contraption | Uncommon | 3 | 3E 1M | 1E 1S | Adjacent Coils produce +1 E |
| Resonance Chamber | Contraption | Common | 3 | 3E 2M | 2S | Its Resonance bonus is +2 |
| Ball Lightning Jar | Contraption | Uncommon | 1 | 3E 3M | 3E | On play: gain 2 E |
| Egg of Columbus | Contraption | Rare | 2 | 2E 2M 1S | 1M 1Mac |  |
| Magnifying Transmitter | Contraption | Rare | 2 | 4E 2M 2S | 3E 1Mac | Coil. Your device is Shielded while this is worked |
| Gaslight Avenger | Distraction | Common | 2 | 1E 1S |  | Jam a rival contraption |
| Conductor | Distraction | Uncommon | 2 | 2E 2M |  | Jam two adjacent rival contraptions |
| Riveteer | Distraction | Uncommon | 2 | 2E 1O |  | Shield your device; draw 1 card |
| Lady Lumen | Distraction | Rare | 2 | 2E 2M 1S |  | Sabotage up to 3 charge and Jam a rival contraption |

#### Edison (40 cards)

Heroes: Telegraph Kid, Banjo Slam, Texas Sparks.

| Card | Type | Rarity | Copies | Cost | Produces | Effect |
| --- | --- | --- | --- | --- | --- | --- |
| Spirit Phone | Doomsday | Legendary | 1 | 10E 8O 14S 4Mac |  | Passive: your Phonographs produce +1 S |
| Grid of Ten Thousand Bulbs | Doomsday | Legendary | 1 | 18E 10O 4S 4Mac |  | Passive: your minion cap is 7 |
| Kinetoscope of Ruin | Doomsday | Legendary | 1 | 12E 10O 10S 4Mac |  | Passive: whenever you Swap, also Jam one of the swapped cards |
| Menlo Park Mucker | Worker | Uncommon | 3 | 1E 1O |  | Recruit 1 permanent minion |
| Filament Bench | Contraption | Common | 3 | 0 | 1E |  |
| Bamboo Grove | Contraption | Common | 3 | 1E | 2O |  |
| Dynamo | Contraption | Common | 3 | 1E 1O | 2E |  |
| Phonograph | Contraption | Common | 3 | 2E 1O | 1E 1S | Phonograph |
| Quadruplex Telegraph | Contraption | Common | 2 | 2E 1O | 2E | +1 E per adjacent contraption you own (max +2) |
| Stock Ticker | Contraption | Uncommon | 2 | 2E 2O | 1Mac |  |
| Black Maria Studio | Contraption | Uncommon | 3 | 2E 2O | 2O 1S |  |
| Kinetoscope Parlor | Contraption | Common | 3 | 2E 2O 1S | 2S |  |
| Patent Office | Contraption | Rare | 2 | 3E 2O 1S | 2Mac | Your device is Shielded while this is worked |
| Pearl Street Station | Contraption | Rare | 2 | 4E 3O | 3E | Adjacent contraptions you own produce +1 |
| Telegraph Kid | Distraction | Common | 3 | 1E 1O |  | Steal up to 2 of one resource |
| Banjo Slam | Distraction | Uncommon | 3 | 2E 1O |  | Swap two rival contraptions |
| Texas Sparks | Distraction | Rare | 2 | 3E 2O |  | Steal up to 2 MacGuffin, or Bounce a rival contraption |

**Design notes:**

- Edison has no Magic producers, so Magic only matters to Tesla. Edison could still work a Tesla Magic machine in Public Works.
- Tesla makes almost no Organic, so its few Organic costs (Induction Motor, Riveteer) push it to work Edison's Public Works machines too.
- Both decks have exactly 4 MacGuffin-producing copies, and every doomsday device needs 4 MacGuffin, so MacGuffin machines in Public Works become the main fight.

**Decide:** names, numbers and effects are all open to change. Mark up anything here.

## AI opponent

The AI plays whichever deck you don't, using a simple scoring strategy that you can watch act step by step.

- **Strategy** *(proposed)*: score each legal action by how much it advances the AI's doomsday charge, plus a bonus for combos and a bonus for disrupting a rival who is close to winning. Take the highest-scoring action and repeat until nothing is worth doing.
- **Readability:** about 600 ms between AI actions, with the acting card highlighted and a one-line log entry for each action.
- **Difficulty:** Easy (sometimes picks the second-best action) and Normal *(proposed)*.

The v1 AI never bluffs or holds cards back. Smarter play is on the roadmap as a later phase.

## Visual direction

The game looks like a Windows 95-era browser game, with 16-bit pixel sprites hovering over the cards.

**Windows 95 chrome** *(proposed specifics)*:

- Grey beveled panels (#C0C0C0), navy title bars (#000080) with fake minimize and close buttons, teal desktop background (#008080)
- The match board is a "window"; the resource bar is styled as a taskbar with a system tray
- Prompts appear as modal dialog boxes, for example "Are you sure you want to end the world?" with OK and Cancel
- A free pixel-font lookalike for the classic system font; no Microsoft font files
- **Touch rule:** every tap target is at least 44 points, even when it looks period-sized

**Pixel sprites** *(proposed)*:

- 32x32 pixels, drawn in code as pixel maps and scaled with nearest-neighbor rendering so they stay crisp
- Each deck uses a limited palette of about 16 colors (see Decks)
- Idle: a 2-frame hover bob above the card once played
- Work: a 2-frame action when a minion is placed
- Combo: adjacent sprites turn toward each other and pass a spark, beam or particle between them

**Card design:**

- A solid black outer border; the rest of the card body is transparent, so the board shows through.
- A thin inner border, set just inside the black border without touching it, colored by rarity.
- Pixel art and card text sit on the transparent body. When the card is played, both lift off the card into 3D space with perspective and a soft shadow below.
- **Readability rule** *(proposed)*: card text gets a 1-pixel dark outline so it stays legible over any board color.
- Layout *(proposed)*: name at top, cost pips top left, pixel art in the middle, output icons below the art, rules text at the bottom.

**Rarity** *(proposed tiers and counts per 40-card deck)*:

| Rarity | Inner border | Effect | Cards per deck |
| --- | --- | --- | --- |
| Common | Silver-grey | None | 20 |
| Uncommon | Bronze | Slow light sweep across the card every few seconds | 11 |
| Rare | Gold | Twinkling pixel sparkles | 6 |
| Legendary | Rainbow | Holographic shimmer that shifts as the card tilts or is dragged; doomsday devices are always Legendary | 3 |

**Style references** (for look and feel only; nothing copied):

- The current edition of MetaZoo, for card design
- Pokemon full-art and gallery cards, for art that breaks out of the frame
- Sonic the Hedgehog (1991), for the 16-bit pixel art style

**Palette options.** Pick one per deck. Each lists 6 core colors, darkest to lightest plus an accent. Sprites build out to about 16 colors with in-between shades. The Win95 chrome greys stay the same whichever you choose.

| Option | Deck | Mood | Core hexes |
| --- | --- | --- | --- |
| T1 Arc Light | Tesla | Cold blue lightning, violet highlights | #0B1026, #1E3A8A, #3B82F6, #7DD3FC, #A855F7, #F8FAFC |
| T2 Ether Violet | Tesla | Mystical, magic-forward | #140A24, #3B1A6B, #7C3AED, #C084FC, #22D3EE, #F5F3FF |
| T3 Storm Steel | Tesla | Industrial grey-blue, yellow spark accent | #0F172A, #334155, #64748B, #38BDF8, #E0F2FE, #FDE047 |
| E1 Brass Works | Edison | Warm brass and lamplight | #1C1208, #5C3A12, #B7791F, #F6AD55, #FDE68A, #FFF8E7 |
| E2 Sepia Reel | Edison | Old film and wax cylinders, red accent | #2A1E14, #6B4F35, #A47148, #D6B588, #F2E3C6, #C0392B |
| E3 Gaslight Amber | Edison | Deep amber, green-patina accent | #120D07, #4A2C0A, #D97706, #FBBF24, #FEF3C7, #0F766E |

**Chosen:** T3 Storm Steel for Tesla and E2 Sepia Reel for Edison.

## Interaction, animation and feel

Tap-first controls, clear feedback on every action, and motion that sells the combos.

- **Play a card:** tap it in hand, then tap a grid slot. Drag-and-drop works too *(proposed)*.
- **Place a minion:** tap a minion, then tap a contraption.
- **Inspect:** long-press any card to open a Win95-style "Properties" dialog with full text.
- **Animations:** draw, play (sprite pops up and starts hovering), minion walk-on, resource tick-up into the tray, combo spark, distraction strike, doomsday meter fill, victory and defeat screens.
- **Invalid moves:** a synthesized error-ding in the period style (not the original sound file) plus a short shake; never a silent failure.
- **Sound:** chiptune-style blips made with the Web Audio API; mute toggle in settings.
- **Reduced motion:** a setting that swaps animations for instant updates.

## Screens and flow

The app opens on a fake desktop; each screen is a window launched from it.

1. **Boot screen:** a short, skippable fake startup.
2. **Desktop:** icons for New Game, Continue, How to Play and Settings.
3. **Choose your villain:** Tesla or Edison, each with a short dossier window.
4. **Match:** your grid at the bottom, the rival's at the top, Public Works in the middle (if used), hand along the bottom edge, both doomsday meters always visible.
5. **Results:** a dialog box with the outcome, turn count and a Play Again button.

v1 has the How to Play window only; a scripted tutorial match is a later phase.

## Technical constraints and architecture

One self-contained HTML file in vanilla JavaScript, with the rules engine fully separate from rendering.

- **Delivery:** a single HTML file, built from small modular source files so later phases only touch what they need.
- **Target:** iPhone Safari in landscape, iPhone 12 or newer at 60 fps; prompts to rotate in portrait. Includes home-screen app metadata.
- **Engine:** a pure function, `(state, action) → (newState, events)`. Rendering only reads state and plays events.
- **Randomness:** a seeded random number generator plus an action log, so any bug can be replayed exactly.
- **Data:** all cards in one data block using the schema above; all balance numbers in one config object.
- **Persistence:** localStorage saves the match after every action, so Continue resumes exactly *(proposed)*.
- **Offline:** no network calls.

## Acceptance criteria

v1 is done when every box below is checked.

- [ ] A full match against the AI ends with a winner and no console errors
- [ ] Typical match length is 12 to 15 turns and under 15 minutes
- [ ] Every card in both decks resolves exactly as its rules text says
- [ ] Resonance and card combos trigger correctly and play their sprite animation
- [ ] Replaying a saved seed and action log reproduces the match exactly
- [ ] Closing and reopening the app resumes the match in progress
- [ ] Playable on an iPhone in landscape, with every tap target at least 44 points
- [ ] Neither deck wins more than 60% of AI-vs-AI test matches *(proposed)*

## Phase plan

Seven phases, engine first, so the rules are proven before any art exists. Each phase ends at a gate.

1. **Rules engine:** state, actions, effect vocabulary, seeded randomness, text-only display. *Gate:* a full match plays out in text, from scripted moves.
2. **Card data:** both 40-card decks in the schema. *Gate:* every card's effect passes a test.
3. **Board UI:** Win95 chrome, grid, hand, meters, tap controls. *Gate:* a human can play both sides on a phone.
4. **AI opponent:** scoring strategy, pacing, action log. *Gate:* AI-vs-AI matches finish and stay within the balance target.
5. **Sprites and combos:** card frames, rarity effects, pixel sprites, 3D pop-out, hover, work and combo animations, sound. *Gate:* every combo animates correctly.
6. **Screens and persistence:** desktop, villain select, results, save and resume. *Gate:* all acceptance criteria pass.
7. **Optimization and debug pass:** performance on device, balance tuning, bug fixes. *Gate:* 60 fps and no known bugs.

**Later:** native iOS port, smarter AI that bluffs and holds cards back, scripted tutorial, deck editor, more villains, multiplayer.

## Alternative themes

Three reskins that keep the engine unchanged (two villains, worker placement, five resources with one scarce MacGuffin, heroes as distractions, a doomsday race), so a theme swap is mostly cards, sprites and palettes.

|  | Y2K Rivals | Literary Mad Scientists | Hoax Bureau |
| --- | --- | --- | --- |
| Premise | Rival 1999 tech moguls race to trigger the millennium bug on their own terms | Public domain fiction villains: Moriarty vs. Nemo first; Frankenstein, Jekyll, Moreau later | Two tabloid empires race to make one hoax go global |
| Resources | Bandwidth, Venture Capital, Caffeine, Hype; MacGuffin = The Patent | The current five, with an occult or steampunk tint | Attention, Outrage, Credibility, Reach; MacGuffin = The Big Lie |
| Heroes | Auditors, regulators, a tech journalist, a weekend sysadmin | Victorian detectives, explorers, whistleblowing lab assistants | Fact-checkers, librarians, teachers (Shield = Fact-Check, Jam = Debunk) |
| Doomsday devices | Rollover Virus, Infinite Pop-Up, Dial-Up Singularity | One signature invention per villain | The hoax itself, in three escalating forms |
| Why it works | Strongest fit with the Win95 look; no real-person concerns | Built-in expansion roadmap without licensing a modern IP | Each card names a real manipulation technique, so playing the villain teaches players to spot it (prebunking) |

**Decide:** keep Tesla vs. Edison, switch themes, or add a theme as the first expansion. For Literary Mad Scientists, confirm each character's public domain status first.

## SWOT vs. other digital TCGs

Compared against MTG Arena, Hearthstone, Marvel Snap, Pokémon TCG Pocket and Legends of Runeterra, as of November 2026.

**Strengths**

- A different core: a euro-style worker-placement race on a shared board, where most digital card games are combat races to reduce a life total. Public Works creates interaction without direct combat.
- Balance is measured: 3,000-game simulations put both decks and both seats near 50%, and the data-driven engine makes new decks cheap to add and test.
- No install: runs in a browser and adds to the home screen.
- A distinctive look and tone: Win95 chrome, pixel art and villain comedy stand out from the polished fantasy style most competitors share.

**Weaknesses**

- No big IP, in a market where new digital card game successes are led by major brands.
- Single-player only, with no packs, trading, ladder or progression: the loop that keeps TCG players returning.
- Long matches: about 13 rounds, against a genre norm of roughly 5 to 9 minutes per competitive match.
- A simple AI (greedy, no bluffing) that may feel predictable after a few games.
- No App Store presence, so no store discovery on iOS.

**Opportunities**

- The single-player shift: most new card games on Steam are single-player roguelikes, and Legends of Runeterra has repositioned as a roguelite adventure. A villain career mode (draft contraptions, unlock devices, face escalating rivals) fits an AI-only game.
- Market churn: Marvel Snap had a difficult 2025 and drew criticism for tougher monetization, leaving players open to a fair, low-pressure game.
- Nostalgia: the Win95 and Y2K era is a marketable aesthetic on its own.
- Education and print-and-play: the Hoax Bureau theme could reach schools and libraries, and the rules translate to a physical prototype for crowdfunding.

**Threats**

- Pokémon's scale: TCG Pocket passed 100 million downloads and earned about $1.3 billion in its first year.
- Live-service expectations: constant content and frequent balance patches are hard for a solo developer to sustain.
- Complexity on mobile: euro-style decisions on a phone screen can lose casual players without excellent onboarding.
- Name and likeness risk: "Tesla" is also a major company's trademark, so get a legal review before any commercial release. The Y2K and literary themes avoid this.
