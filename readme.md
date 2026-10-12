# Feeling in Motion

A small, browser-only computational-thinking prototype that turns subjective physical discomfort into abstract marks. Its dark palette, faint oversized body guide, and glowing marks are expressive choices—not medical information or a simulation.

## Open it

1. Open the `Feeling in Motion` folder.
2. Double-click `index.html` (or drag it into a modern web browser).
3. Pick a brush, move the intensity slider, and click or drag on the canvas.
4. Choose **Bring to Life** to animate the marks. Use **Pause** or **Clear Canvas** at any time.

No installation, server, account, or internet connection is needed.

## Computational-thinking ideas

- **Representation:** Four visual rules stand for four sensations: circles for pulsing, jagged lines for burning, dot clusters for blockage, and wavy curves for soreness.
- **State:** `selectedBrush`, `intensity`, `isAnimating`, and `strokes` store the program's current information. Every new mark saves its own brush and intensity, so later slider changes do not alter earlier marks.
- **Interaction:** Pointer events let a visitor choose a brush, control intensity, draw marks, animate them, pause, and clear the canvas. Mouse and touch are both supported through pointer events.
- **Decomposition:** Separate functions draw the body guide, calculate colors, draw each brush, handle pointer input, and update the scene.
- **Pattern recognition and abstraction:** Different real sensations are simplified into repeated visual patterns rather than literal body illustrations or medical claims.
- **Algorithms:** `drawScene()` loops through the `strokes` array. While active, `requestAnimationFrame()` repeats the drawing algorithm; simple conditional rules choose how each brush moves.

## Files

- `index.html` — page structure and controls
- `style.css` — visual design and responsive layout
- `script.js` — state, drawing, interaction, and animation

---

# Learning Process and Design Rationale

## 1. Introduction: the phenomenon

The phenomenon explored in this project is **the subjective experience of physical discomfort during a viral cold**. During a cold, I experienced a pulsing headache, a dry and blocked nose, a sharp burning throat, heat in my chest and stomach, and soreness and weakness in my arms and legs.

These sensations did not always occur in isolation. A blocked nose could appear with a headache, while heat could appear with soreness. The discomfort also tended to feel worse at night and less intense in the morning. This led to the question: how might sensations that are hard to explain in words be communicated visually?

The answer became **Feeling in Motion**: an interactive animated canvas where people can represent how discomfort feels to them through abstract shapes, colors, textures, and movement. This is an expressive artwork, not a diagnostic tool and not an objective measurement of pain.

## 2. Decomposition: breaking down the experience

Decomposition means dividing a complex phenomenon into smaller, manageable parts. I first separated the cold experience by body region and sensation.

| Body region | Sensation |
|---|---|
| Head | Pulsing headache |
| Nose | Dryness and blockage |
| Throat | Sharpness and burning |
| Chest | Heat |
| Stomach | Heat |
| Arms | Soreness and weakness |
| Legs | Soreness and weakness |

This showed that one bodily experience can contain many sensations in different places. It also showed that multiple sensations can occupy the same region: for instance, the nose may feel both dry and blocked. The prototype therefore allows marks from different brushes to overlap, creating hybrid visual forms.

The system can be understood as these smaller components:

- **Body region:** where a sensation is felt.
- **Sensation type:** what the discomfort feels like.
- **Intensity:** how strong the sensation is.
- **Relationships:** which sensations tend to occur together.
- **Visual representation:** the shape, color, density, and texture of a mark.
- **Animation:** movement that expresses the character of the sensation.

## 3. Pattern recognition: finding repeated relationships

Pattern recognition means noticing repeated characteristics and relationships. I noticed that some sensations often happened together, such as blockage and headache, and that discomfort followed a loose time pattern—usually stronger at night and lighter in the morning.

I also translated recurring qualities of sensations into visual patterns:

| Physical sensation | Visual pattern | Movement idea |
|---|---|---|
| Pulsing | Repeated circular forms | Rhythmic expansion and contraction |
| Burning | Jagged, broken strokes | Fast vibration and flaring |
| Sharpness | Angular lines | Sudden, abrupt movement |
| Dryness | Fragmented lines | Gradual separation |
| Blockage | Dense, compressed shapes | Compression and restricted movement |
| Soreness | Soft, layered curves | Slow, uneven undulation |
| Weakness | Thin, fading strokes | Gentle trembling or fading |

These repeated associations informed the preset sensation brushes. Instead of asking a person to describe every feeling with text, the prototype offers a small visual vocabulary that can be selected and drawn directly onto the body guide.

## 4. Abstraction: what to include and leave out

Abstraction means keeping the information that matters for a purpose and leaving out unnecessary detail. The purpose here is to communicate **how discomfort feels to an individual**, not to explain its medical cause. The work therefore does not include age, medication, diagnosis, or exact symptom onset.

It focuses on five visual properties instead:

- **Shape and texture:** circles suggest pulsing; broken angular strokes suggest burning; soft waves suggest soreness.
- **Color:** intensity is mapped continuously from pale yellow through orange to deep red.
- **Distortion and density:** dense clusters can suggest blockage, while distorted curves can suggest soreness.
- **Spatial arrangement:** an oversized, abstract body outline preserves the connection between a mark and a body region without becoming an anatomical diagram.
- **Movement:** animation expresses the changing quality of discomfort rather than a literal physical process.

These visual associations are suggestions, not universal definitions. Two people can experience a headache differently, so the project combines consistent preset rules with personal placement, overlap, and intensity choices.

## 5. Algorithm design: how the current prototype works

The implemented prototype follows a small drawing-and-animation algorithm:

```text
START

displayCanvas()
displayFaintBodyOutline()
strokes = []

WHEN a user selects a brush:
    selectedBrush = chosen brush

WHEN a user changes the slider:
    intensity = slider value

WHILE the user clicks or drags on the canvas:
    color = mapIntensityToColor(intensity)
    mark = createMark(selectedBrush, intensity, color, pointer position)
    save mark in strokes
    redraw canvas

WHEN the user presses "Bring to Life":
    isAnimating = true
    REPEAT with requestAnimationFrame:
        FOR each mark in strokes:
            choose its movement rule from its brush type
            use its saved intensity to control movement strength
            draw the animated mark

WHEN the user presses "Pause":
    isAnimating = false

WHEN the user presses "Clear Canvas":
    strokes = []
    keep the body outline

END
```

This demonstrates several computational structures:

- **Sequence:** select, set intensity, draw, save, then animate.
- **Selection:** conditionals choose a different drawing and movement rule for each brush.
- **Iteration:** a loop redraws every saved mark; `requestAnimationFrame()` repeats the animation smoothly.
- **Variables:** `selectedBrush`, `intensity`, `isAnimating`, and `strokes` store changing information.
- **Functions:** separate functions draw the body guide, map intensity to color, draw each sensation, and update the canvas.

## 6. Extended concept explored during planning

During planning, I also considered a larger version of the system. In that version, a user could connect two marks with a blurred translucent line to show that the sensations tend to co-occur. A more opaque connection could mean the relationship feels stronger. Connected marks might then respond subtly to one another during animation.

I also considered allowing users to adjust an animation's speed and strength after it is generated. Those features are useful ideas for a later iteration, but they are **not implemented in this small classroom prototype**. Keeping them separate helps the current work remain focused and understandable while preserving the next design direction.

## 7. Reflection

Computational thinking helped move this project from a personal experience toward a structured interactive system. Decomposition identified body regions and sensations; pattern recognition created a visual vocabulary; abstraction removed medical detail that did not serve the expressive goal; and algorithm design organized the drawing and animation behavior.

An important conclusion is that the same symptom does not feel the same to everyone. The computer supplies a few visual rules and movement behaviors, but the participant decides where marks go, which sensations overlap, and how intense they should be. That balance between computational structure and creative control is the central idea of **Feeling in Motion**.

> **Final concept statement:** *Feeling in Motion* is an interactive animated canvas for visualizing subjective physical discomfort. Preset sensation brushes, an intensity-based color gradient, overlapping marks, an abstract body guide, and responsive animations translate bodily feelings into personal visual compositions.
