# SMTree

Static website/visualization for the ever-so complex roleplay between people playing block man games.

Best viewed on desktop.

## Why

Why not?

## Contributing

Block men go brr, someone has a child, a new person joins the server. I wasn't watching. Thousands of other people were. So, how do _you_ help ensure everyone's in on the latest news?

### Tweet @mebird\_ on Twitter With a Clip

If I've replied or liked the tweet, then it's in.

### Open an Issue/PR

For those GitHub savvy, feel free to open an issue or PR listing the update. The JSON all lives in `src/data`. New characters should be added with a new ID in `characters`, and then a corresponding metadata file in `metadata`. Relationships should be appended to the appropriate relationship array in `relationships`. If you'd like to try and add HermitCraft, feel free to create a new SMP file in `smps`, and then go from there. _If there's enough demand, I'm going to look away from using integer IDs for characters to UUIDs, but, for now, we got integers._

## Technical Bits

### Stack

- Static Gatsby Site
- React
- Graph built with `force-graph`
- JSON Data Source (`data` folder)

### Setup

```sh
npm i
gatsby build
gatsby serve -p 8000
```

### Notes

Built from the ground up. Wanted to play with Gastby/GraphQL/React.
