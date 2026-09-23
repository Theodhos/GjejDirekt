// Left behind by moving FoodListingPage to components/listings/BusinessPage: an already running `next dev` keeps
// a stale reference to this path and answers 500 without it. Nothing imports this file —
// delete it after restarting the dev server.
export { default } from "@/components/listings/BusinessPage";
