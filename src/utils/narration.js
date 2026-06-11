import { say, pause, cheer, ask, think, celebrate, instruct } from './audio';

export const introNarration = () => [
  say("Welcome to Estimation!"),
  pause(200),
  say("I'm Spark, your math guide."),
  say("In this lesson, you'll learn how to make super-smart close guesses!"),
  say("And that's a skill you'll use your whole life."),
  pause(200),
  cheer("Let's go on an adventure!")
];

export const wonderNarration = () => [
  say("Sarah and John are at the book fair."),
  say("Sarah has 247 coins. A book costs 189 coins."),
  pause(300),
  think("She needs to decide fast... does she have enough?"),
  pause(200),
  say("Watch how she uses a special math trick called estimation!")
];

export const storyNarrationP1 = () => [
  say("John and Sarah are helping at Mike's fruit stall at the Saturday market."),
  say("It's a busy day, and there's no time to use paper and pencil!"),
  ask("Mike says... about how many mangoes have I sold in two days?")
];

export const storyNarrationP2 = () => [
  say("Sarah says: Remember what Emma taught us? Round first!"),
  pause(200),
  instruct("Three hundred and eighteen is close to three hundred."),
  instruct("Two hundred and fifty-three is close to two hundred and fifty."),
  say("Look at the number line... three eighteen is closer to three hundred than to three fifty. So we round down!")
];

export const storyNarrationP3 = () => [
  say("Three hundred plus two hundred and fifty equals five hundred and fifty!"),
  cheer("Mike sold about five hundred and fifty mangoes total!"),
  pause(200),
  say("The exact answer is five hundred and seventy-one... and our estimate of five fifty is very close!"),
  celebrate("That's the power of estimation!")
];

export const storyNarrationP4 = () => [
  say("Now here's a subtraction challenge."),
  say("John brought four hundred and sixty-two flyers. They gave out one hundred and seventy-nine."),
  ask("About how many flyers are left? Let's round!"),
  instruct("Four sixty-two rounds up to five hundred. One seventy-nine rounds up to two hundred."),
  cheer("Five hundred minus two hundred is three hundred!")
];

export const storyNarrationP5 = () => [
  say("The exact answer is two hundred and eighty-three."),
  cheer("Our estimate was three hundred... that's really close!"),
  say("Sarah says: Estimation isn't about being perfect... it's about being smart!"),
  say("And people everywhere use this trick every single day.")
];

export const storyNarrationP6 = () => [
  instruct("Here's the three-step secret:"),
  say("Step one... round each number."),
  say("Step two... add or subtract the rounded numbers."),
  ask("Step three... check! Is your estimate close?"),
  cheer("If yes, you're an estimator! Now let's try it ourselves!")
];

export const simulateIntroNarration = () => [
  say("Welcome to the interactive sandbox!"),
  instruct("Complete all three stations to earn your badge.")
];

export const simulateStationANarration = () => [
  instruct("Drag the glowing dot to the round number that this number is closest to."),
  say("Remember — look at which big number it's nearest to on the number line!")
];

export const simulateStationBNarration = () => [
  instruct("Look at this problem. Round the numbers in your head, then choose the best estimate from the four choices."),
  cheer("Watch the Estimate-O-Meter!")
];

export const simulateStationCNarration = () => [
  cheer("Time to build your own estimate!"),
  instruct("First, round each number. Then add or subtract."),
  say("You're thinking like a real mathematician!")
];

export const playIntroNarration = () => [
  say("Welcome to IntelliPlay!"),
  instruct("Complete all 10 worlds by solving estimation challenges."),
  cheer("Good luck!")
];

export const reflectNarration = () => [
  celebrate("Amazing work!"),
  pause(300),
  ask("Before you get your badge, tell me... when might YOU use estimation in real life?"),
  say("Think about it and write your answer below!")
];

export const simulationsHubNarration = () => [
  cheer("Welcome to Estimation Simulations!"),
  say("You have three fun challenges to try."),
  instruct("First, estimate how many objects are in a jar. Then find numbers on a number line. Finally, help a pirate reach hidden treasure!"),
  cheer("Try them all to earn stars!")
];

export const jarEstimationNarration = () => [
  instruct("Look carefully at the jar and count the objects inside."),
  say("Try to spot groups or patterns to help you estimate."),
  ask("When you are ready, enter your best guess!")
];

export const numberLineTargetNarration = () => [
  say("A number line helps us see where numbers live between other numbers."),
  instruct("Drag the slider until the marker is exactly where your target number should be."),
  cheer("There are three levels, each with a bigger range!")
];

export const treasureMapNarration = () => [
  say("A pirate needs your help! Use the grid to estimate the distance to the treasure."),
  instruct("Remember, each square on the map equals ten steps."),
  ask("Which answer is closest to the real distance?")
];
