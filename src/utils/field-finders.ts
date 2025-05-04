import { FieldSelector } from "./mapping-types";

/**
 * Checks if an element is visible and interactable (basic check).
 */
const isVisible = (element: HTMLElement): boolean => {
  if (!element) return false;
  const style = window.getComputedStyle(element);
  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    style.opacity !== "0" &&
    element.offsetParent !== null
  );
};

/**
 * Finds a field by its associated <label> text content.
 * Handles labels wrapping the input or using the 'for' attribute.
 */
export const findFieldByLabel = (
  labelText: string | RegExp | (string | RegExp)[],
  elementType: "input" | "textarea" | "select" | undefined = undefined
): HTMLElement | null => {
  const labels = Array.from(document.querySelectorAll("label"));
  const searchTerms = Array.isArray(labelText) ? labelText : [labelText];

  for (const term of searchTerms) {
    const regex =
      term instanceof RegExp
        ? term
        : new RegExp(term.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"), "i");
    for (const label of labels) {
      const labelTextContent = label.textContent?.trim() || "";
      if (regex.test(labelTextContent)) {
        let field: HTMLElement | null = null;
        // 1. Check direct child
        field = label.querySelector("input, textarea, select");
        if (
          field instanceof HTMLElement &&
          isVisible(field) &&
          (!elementType || field.tagName.toLowerCase() === elementType)
        )
          return field;
        // 2. Check 'for' attribute
        const htmlFor = label.getAttribute("for");
        if (htmlFor) {
          field = document.getElementById(htmlFor);
          if (
            field instanceof HTMLElement &&
            isVisible(field) &&
            (!elementType || field.tagName.toLowerCase() === elementType)
          )
            return field;
        }
        // 3. Check aria-labelledby
        const labelId = label.id;
        if (labelId) {
          field = document.querySelector(`[aria-labelledby="${labelId}"]`);
          if (
            field instanceof HTMLElement &&
            isVisible(field) &&
            (!elementType || field.tagName.toLowerCase() === elementType)
          )
            return field;
        }
        // 4. Check sibling
        const nextSibling = label.nextElementSibling;
        if (
          nextSibling instanceof HTMLElement &&
          ("input" === nextSibling.tagName.toLowerCase() ||
            "textarea" === nextSibling.tagName.toLowerCase() ||
            "select" === nextSibling.tagName.toLowerCase())
        ) {
          if (
            isVisible(nextSibling) &&
            (!elementType || nextSibling.tagName.toLowerCase() === elementType)
          )
            return nextSibling;
        }
        // 5. Check parent's sibling (common in some structures)
        const parentSibling = label.parentElement?.nextElementSibling;
        if (
          parentSibling instanceof HTMLElement &&
          ("input" === parentSibling.tagName.toLowerCase() ||
            "textarea" === parentSibling.tagName.toLowerCase() ||
            "select" === parentSibling.tagName.toLowerCase())
        ) {
          if (
            isVisible(parentSibling) &&
            (!elementType || parentSibling.tagName.toLowerCase() === elementType)
          )
            return parentSibling;
        }
        // 6. Check parent for aria-label or aria-labelledby matching label text (for complex components)
        const parentElement = label.closest(
          '[role="group"], [role="radiogroup"], div, span'
        ); // Common grouping elements
        if (parentElement) {
          const ariaLabel = parentElement.getAttribute("aria-label");
          const ariaLabelledBy = parentElement.getAttribute("aria-labelledby");
          let ariaTextMatch = false;
          if (ariaLabel && regex.test(ariaLabel)) {
            ariaTextMatch = true;
          }
          if (!ariaTextMatch && ariaLabelledBy) {
            const sourceLabel = document.getElementById(ariaLabelledBy);
            if (sourceLabel && regex.test(sourceLabel.textContent || "")) {
              ariaTextMatch = true;
            }
          }
          if (ariaTextMatch) {
            field = parentElement.querySelector("input, textarea, select");
            if (
              field instanceof HTMLElement &&
              isVisible(field) &&
              (!elementType || field.tagName.toLowerCase() === elementType)
            )
              return field;
          }
        }
      }
    }
  }

  // Fallback: direct attribute matching (less reliable than label association)
  for (const term of searchTerms) {
    if (typeof term === "string") {
      const safeTerm = term.replace(/["'[\]]/g, "\\$&");
      const genericSelectors = [
        `${elementType || "input, textarea, select"}[name*="${safeTerm}" i]`,
        `${elementType || "input, textarea, select"}[id*="${safeTerm}" i]`,
        `${elementType || "input, textarea, select"}[placeholder*="${safeTerm}" i]`,
        `${elementType || "input, textarea, select"}[aria-label*="${safeTerm}" i]`,
      ];
      for (const selector of genericSelectors) {
        try {
          const potentialField = document.querySelector(selector);
          if (potentialField instanceof HTMLElement && isVisible(potentialField)) {
            return potentialField;
          }
        } catch (e) {
          console.warn("Error in fallback selector:", selector, e);
        } // Catch invalid selector syntax
      }
    }
  }
  return null;
};

/**
 * Finds a form element based on an array of FieldSelector objects.
 * Tries selectors in order and returns the first visible match.
 */
export const findFormField = (selectors: FieldSelector[]): HTMLElement | null => {
  for (const sel of selectors) {
    let element: HTMLElement | null = null;

    if (sel.selector) {
      try {
        element = document.querySelector(sel.selector);
        if (element && isVisible(element)) return element;
      } catch (e) {
        console.warn(`Invalid selector: ${sel.selector}`, e);
      }
    }
    if (sel.label) {
      element = findFieldByLabel(sel.label, sel.elementType);
      if (element && isVisible(element)) return element;
    }
    if (sel.name) {
      const nameAttr =
        typeof sel.name === "string"
          ? `[name="${sel.name}"]`
          : `[name*="${sel.name.source}"]`;
      element = document.querySelector(
        `${sel.elementType || "input, textarea, select"}${nameAttr}`
      );
      if (element && isVisible(element)) return element;
    }
    if (sel.id) {
      const idAttr =
        typeof sel.id === "string" ? `#${sel.id}` : `[id*="${sel.id.source}"]`;
      element = document.querySelector(
        `${sel.elementType || "input, textarea, select"}${idAttr}`
      );
      if (element && isVisible(element)) return element;
    }
    if (sel.placeholder) {
      const placeholderAttr =
        typeof sel.placeholder === "string"
          ? `[placeholder="${sel.placeholder}"]`
          : `[placeholder*="${sel.placeholder.source}"]`;
      element = document.querySelector(
        `${sel.elementType || "input, textarea, select"}${placeholderAttr}`
      );
      if (element && isVisible(element)) return element;
    }
  }
  return null;
};
