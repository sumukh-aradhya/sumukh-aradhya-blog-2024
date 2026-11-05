import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "./study.css";
import { Brand } from "@/components/lab/brand";
import { BlindGame } from "@/components/gradient-descent/blind-game";
import { Compass } from "@/components/gradient-descent/compass";
import { ControlRoom } from "@/components/gradient-descent/control-room";
import { Deck, type Chapter } from "@/components/gradient-descent/deck";
import { Finale } from "@/components/gradient-descent/finale";
import { Formula } from "@/components/gradient-descent/formula";
import { Landscape } from "@/components/gradient-descent/landscape";
import { StepSize } from "@/components/gradient-descent/step-size";
import { Story } from "@/components/gradient-descent/story";
import { StudyProvider } from "@/components/gradient-descent/study-state";
import { Vote } from "@/components/gradient-descent/vote";
import { WhatGoesWrong } from "@/components/gradient-descent/what-goes-wrong";

export const metadata: Metadata = {
  title: "gradient descent, explained by playing with it · sumukh aradhya",
  description:
    "you're blindfolded on a hill. find the lowest point. an interactive study of how a machine learns which way to improve",
  alternates: { canonical: "/lab/gradient-descent" },
  openGraph: {
    title: "gradient descent, explained by playing with it",
    description: "you're blindfolded on a hill. find the lowest point",
    url: "/lab/gradient-descent",
    siteName: "Sumukh Aradhya",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "gradient descent, explained by playing with it",
    description: "you're blindfolded on a hill. find the lowest point",
  },
};

const CODE = `import numpy as np

x = np.array([-2, -1, 0, 1, 2], dtype=float)
y = np.array([-1.5, -0.25, 0.7, 1.1, 2.9])

m, b = -0.6, 0.3   # a bad guess
rate = 0.2         # the step size

for step in range(50):
    miss = m * x + b - y           # how wrong is each point?
    grad_m = 2 * np.mean(miss * x) # which way is uphill?
    grad_b = 2 * np.mean(miss)
    m -= rate * grad_m             # step the other way
    b -= rate * grad_b

print(m, b)  # 1.015 0.59`;

const REFERENCES = [
  { title: "why momentum really works", source: "gabriel goh, distill, 2017", href: "https://distill.pub/2017/momentum/" },
  { title: "an overview of gradient descent optimization algorithms", source: "sebastian ruder, 2016", href: "https://arxiv.org/abs/1609.04747" },
  { title: "adam: a method for stochastic optimization", source: "kingma and ba, 2014", href: "https://arxiv.org/abs/1412.6980" },
  { title: "identifying and attacking the saddle point problem", source: "dauphin et al, 2014", href: "https://arxiv.org/abs/1406.2572" },
  { title: "learning representations by back-propagating errors", source: "rumelhart, hinton and williams, 1986", href: "https://doi.org/10.1038/323533a0" },
  { title: "optimization for training deep models", source: "goodfellow, bengio and courville, deep learning, chapter 8", href: "https://www.deeplearningbook.org/contents/optimization.html" },
];

const CHEATS: { term: string; means: React.ReactNode }[] = [
  { term: "error", means: "one number for how wrong the model is" },
  { term: "gradient", means: "which way the error rises fastest, one number per setting" },
  { term: "update", means: <Formula tex="\theta \leftarrow \theta - \eta\,\nabla \text{error}(\theta)" /> },
  { term: "step size", means: <span>stable below <Formula tex="2 / \lambda_{\max}" /> on a bowl</span> },
  { term: "slow training", means: "a stretched valley. normalise your inputs" },
  { term: "flat", means: "can be a saddle or a top, not just a bottom" },
  { term: "batches", means: "noisier steps, far cheaper, how everything is really trained" },
  { term: "momentum", means: "keep some speed, roll past small bumps" },
  { term: "adam", means: "momentum plus a step size for each setting. a good default" },
];

const chapters: Chapter[] = [
  {
    id: "play",
    label: "the game",
    layout: "play",
    learned: "you never needed to see the hill. the tilt under your feet was enough",
    figure: <BlindGame />,
  },
  {
    id: "the-line",
    label: "the line",
    layout: "side",
    ask: "so what was this hill?",
    learned: "the hill is every possible line, and height is how wrong each one is",
    title: "that hill was a line",
    lead: (
      <p>
        every spot on the hill is one line through these points. each square shows how wrong the line
        is about one point, and your height was their average size. shrink them
      </p>
    ),
    figure: <Landscape />,
    deeper: [
      {
        q: "why squares?",
        a: (
          <div>
            <p>
              a miss above the line and a miss below it would cancel out if you just added them.
              squaring makes every miss count, makes big misses hurt far more, and gives a smooth hill
              with a clear tilt everywhere. it&apos;s a choice, not a law. absolute error is common too
            </p>
            <Formula block tex="\text{error}(m, b) = \frac{1}{n} \sum_{i=1}^{n} (m x_i + b - y_i)^2" />
          </div>
        ),
      },
      {
        q: "why can't a model just look at the whole map?",
        a: (
          <p>
            this hill has 2 directions. a real model has millions, one for each number it can adjust.
            checking just 10 spots along 100 directions is already <Formula tex="10^{100}" /> spots,
            far more than the roughly <Formula tex="10^{80}" /> atoms in the observable universe. so a
            real model is always blindfolded
          </p>
        ),
      },
      {
        q: "why is it a perfect bowl?",
        a: (
          <p>
            the error squares every miss, and each miss is a straight-line function of the tilt and
            height. that always makes a bowl with one bottom, as long as the points don&apos;t all share
            the same x. a neural network&apos;s hill has ridges, plains and many valleys
          </p>
        ),
      },
      {
        q: "why is the bowl stretched?",
        a: (
          <div>
            <p>changing the tilt hurts twice as fast as changing the height here, because the points are spread out along x</p>
            <Formula
              block
              tex="\frac{\partial^2 \text{error}}{\partial m^2} = \frac{2}{n}\sum x_i^2 = 4 \qquad \frac{\partial^2 \text{error}}{\partial b^2} = 2"
            />
          </div>
        ),
      },
      {
        q: "if there's a bottom, why not just solve for it?",
        a: (
          <div>
            <p>for a line you can, and this formula lands on it in one go:</p>
            <Formula
              block
              tex="m^* = \frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sum (x_i - \bar{x})^2} \qquad b^* = \bar{y} - m^*\bar{x}"
            />
            <p>gradient descent earns its keep when no such formula exists, or the model is too big to use one. that covers nearly every neural network</p>
          </div>
        ),
      },
    ],
  },
  {
    id: "downhill",
    label: "which way is down",
    layout: "side",
    ask: "how does it know which way is down?",
    learned: "the gradient is which way the error rises. so you walk the other way",
    title: "which way is downhill?",
    lead: (
      <p>
        the model can&apos;t see this map. it can only nudge each number a tiny bit and feel whether the
        error drops. those nudges are called the gradient. guess first, then check
      </p>
    ),
    figure: <Compass />,
    deeper: [
      {
        q: "the actual calculus",
        a: (
          <div>
            <p>a nudge that&apos;s infinitely small is a derivative. for this error:</p>
            <Formula
              block
              tex="\frac{\partial \text{error}}{\partial m} = \frac{2}{n}\sum (m x_i + b - y_i)\,x_i"
            />
            <Formula block tex="\frac{\partial \text{error}}{\partial b} = \frac{2}{n}\sum (m x_i + b - y_i)" />
            <p>and all of gradient descent is one line:</p>
            <Formula block tex="\theta_{\text{next}} = \theta - \eta \, \nabla \text{error}(\theta)" />
          </div>
        ),
      },
      {
        q: "is downhill the same as toward the bottom?",
        a: (
          <p>
            no, and this is the surprise. on a stretched bowl the steepest way down usually doesn&apos;t
            point at the bottom. the gradient only knows the ground under your feet. &quot;steepest&quot;
            also depends on your units: measure the tilt differently and the map stretches
          </p>
        ),
      },
    ],
  },
  {
    id: "the-points",
    label: "the points",
    layout: "top",
    ask: "where does that direction come from?",
    learned: "the direction comes from the data. the worst misses pull hardest",
    title: "every point gets a say",
    lead: <p>each point pulls the line toward itself, and the worse the miss, the harder the pull. add up all the pulls and you get the direction. drag a point</p>,
    figure: (
      <Vote
        formula={
          <Formula
            block
            tex="\text{pull}_i = -\htmlClass{term-share}{\frac{2}{n}} \cdot \htmlClass{term-miss}{r_i} \cdot \htmlClass{term-lever}{\begin{bmatrix} x_i \\ 1 \end{bmatrix}}"
          />
        }
      />
    ),
    deeper: [
      {
        q: "is it really a vote?",
        a: <p>not a fair one. a point&apos;s say grows with how badly the line misses it, so one wild outlier can outshout everyone else. this is why squared error is so sensitive to bad data. try the outlier button</p>,
      },
      {
        q: "why does the gradient point uphill then?",
        a: <p>by definition, the gradient points where the error rises fastest. each arrow here is drawn as a pull, the negative of that point&apos;s share, because that&apos;s the way it wants the line to move. they add up to exactly the negative gradient</p>,
      },
      {
        q: "what does this have to do with neural networks?",
        a: <p>same idea, with billions of directions instead of 2. each example still pulls on every number in the model. backpropagation is an efficient way to work out all of those pulls at once, using the chain rule</p>,
      },
    ],
  },
  {
    id: "step-size",
    label: "step size",
    layout: "side",
    ask: "so how far should it step?",
    learned: "the gradient says which way. the step size decides if it works at all",
    title: "how big a step?",
    lead: <p>the direction says which way, not how far. too small takes forever. too big makes things worse with every step. this one setting matters more than almost anything</p>,
    figure: <StepSize />,
    deeper: [
      {
        q: "where does the limit come from?",
        a: (
          <div>
            <p>
              in the steepest direction, with curvature <Formula tex="\lambda" />, each step multiplies
              your distance from the bottom by <Formula tex="1 - \eta\lambda" />. bigger than 1 in size
              means you&apos;re moving away, so:
            </p>
            <Formula block tex="\eta < \frac{2}{\lambda_{\max}} = \frac{2}{4} = 0.5" />
            <p>at exactly 0.5 that number is -1, so the tilt flips side to side forever</p>
          </div>
        ),
      },
      {
        q: "why does wobbly still get there?",
        a: <p>between 0.25 and 0.5, each step overshoots the bottom along the tilt, but lands closer than it started. at 0.25 exactly, the tilt lands on the bottom in one step</p>,
      },
      {
        q: "how do people pick it in practice?",
        a: <p>mostly by trying. a common recipe: start small, raise it until the error blows up, then back off. it also usually shrinks during training, so you take big steps early and careful ones at the end</p>,
      },
    ],
  },
  {
    id: "goes-wrong",
    label: "what goes wrong",
    layout: "side",
    ask: "does this always work?",
    learned: "flat doesn't mean finished, steep walls slow you down, and every step is a guess",
    title: "what goes wrong",
    lead: <p>that bowl was friendly. real hills are messier, in 3 ways</p>,
    figure: <WhatGoesWrong />,
    deeper: [
      {
        q: "why is a stretched valley slow?",
        a: (
          <div>
            <p>the step size has to suit the steepest direction, and progress is limited by the gentlest. their ratio is the condition number:</p>
            <Formula block tex="\kappa = \frac{\lambda_{\max}}{\lambda_{\min}} \qquad \text{steps} \propto \kappa" />
          </div>
        ),
      },
      {
        q: "how do real systems deal with it?",
        a: <p>normalising inputs and batch normalisation round the bowl. momentum and adam work around the shape without changing it. newton&apos;s method uses the curvature directly, but it&apos;s far too expensive for a model with billions of numbers</p>,
      },
      {
        q: "are bad valleys a real problem?",
        a: <p>less than people once feared. in millions of dimensions, a true dead end needs the ground to rise in every direction at once, and most flat spots turn out to be saddles. slow progress near them is the more common problem</p>,
      },
      {
        q: "the hill on the &quot;stuck&quot; tab".replace(/&quot;/g, '"'),
        a: <Formula block tex="f(a, b) = (a^2 - 1)^2 + 0.4\,b^2" />,
      },
    ],
  },
  {
    id: "your-turn",
    label: "your turn",
    layout: "top",
    ask: "want to try it yourself?",
    learned: "every optimiser is a different answer to one question: how should i step?",
    title: "your turn",
    lead: <p>a new hill with 2 valleys, and the settings people really tune. drag the ring, turn the dials, or try a preset. the hill is made up. every step is real</p>,
    figure: <ControlRoom />,
    deeper: [
      {
        q: "the update rules",
        a: (
          <div>
            <p>momentum keeps a running speed:</p>
            <Formula block tex="v_{t+1} = \beta v_t + g_t \qquad x_{t+1} = x_t - \eta v_{t+1}" />
            <p>rmsprop divides by the recent size of the slope:</p>
            <Formula block tex="s_{t+1} = \beta_2 s_t + (1-\beta_2) g_t^2" />
            <Formula block tex="x_{t+1} = x_t - \frac{\eta\, g_t}{\sqrt{s_{t+1}} + \epsilon}" />
            <p>adam does both, and corrects for starting at zero</p>
          </div>
        ),
      },
      {
        q: "which optimiser should i use?",
        a: <p>adam is a solid first choice, and forgiving about the learning rate. plain sgd with momentum is still widely used and can generalise better, but needs more tuning. don&apos;t read too much into one hill: no optimiser wins everywhere</p>,
      },
      {
        q: "what's simplified here?",
        a: <p>this hill is 1 dimensional, and batch noise is simulated as random error added to the slope, shrinking with batch size. in real training the noise comes from which examples you sampled. adam&apos;s real strength, a step size for every number, can&apos;t show up with only one number</p>,
      },
    ],
  },
  {
    id: "recap",
    label: "the recap",
    layout: "story",
    ask: "so what did we just learn?",
    title: "so, what is gradient descent?",
    lead: <Story />,
    figure: <Finale />,
    deeperLabel: "cheat sheet, code and further reading",
    deeper: [
      {
        q: "cheat sheet",
        a: (
          <dl className="gd-cheats">
            {CHEATS.map((c) => (
              <div key={c.term}>
                <dt>{c.term}</dt>
                <dd>{c.means}</dd>
              </div>
            ))}
          </dl>
        ),
      },
      {
        q: "the entire algorithm, in code you can run",
        a: (
          <pre className="gd-code" tabIndex={0}>
            <code>{CODE}</code>
          </pre>
        ),
      },
      {
        q: "where to go next",
        a: (
          <ul className="gd-refs">
            {REFERENCES.map((r) => (
              <li key={r.href}>
                <a href={r.href} target="_blank" rel="noopener noreferrer">
                  {r.title}
                </a>
                <span>{r.source}</span>
              </li>
            ))}
          </ul>
        ),
      },
    ],
  },
];

export default function GradientDescentStudy() {
  return (
    <StudyProvider>
      <header className="lab-header">
        <Brand study="gradient descent" />
      </header>
      <Deck chapters={chapters} />
    </StudyProvider>
  );
}
