export default function randomLightBgColor(): string {
  // Generate random values for red, green, and blue components
  const red = Math.floor(Math.random() * 56) + 200; // Values between 200 and 255 for a lighter shade
  const green = Math.floor(Math.random() * 56) + 200;
  const blue = Math.floor(Math.random() * 56) + 200;

  // Convert the RGB values to hexadecimal format
  const hexColor = `#${red.toString(16).padStart(2, "0")}${green
    .toString(16)
    .padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;

  return hexColor;
}
