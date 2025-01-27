import type { Fragment } from "../fragment";

export const FRAGMENT_TYPE_TEMPLATE_FEED = "template-feed";

export const TEMPLATE_FEED = "";

export interface TemplateFeedFragment extends Fragment
{
  type: typeof FRAGMENT_TYPE_TEMPLATE_FEED;
  value: typeof TEMPLATE_FEED;
}

export function createTemplateFeedFragment(
  index: number,
): TemplateFeedFragment
{
  return {
    index,
    type: FRAGMENT_TYPE_TEMPLATE_FEED,
    value: TEMPLATE_FEED,
  };
}

export function isTemplateFeedFragment(
  fragment: Fragment,
): fragment is TemplateFeedFragment
{
  return fragment.type === FRAGMENT_TYPE_TEMPLATE_FEED;
}
