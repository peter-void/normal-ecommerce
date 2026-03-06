/**
 * ============================================================================
 * REACT COMPONENT TESTS - LEARNING EXAMPLES
 * ============================================================================
 *
 * This file demonstrates testing React components.
 * While Button and Badge are shadcn components (third-party),
 * these tests show you HOW to test React components in general.
 *
 * KEY CONCEPTS FOR COMPONENT TESTING:
 * - render(): Renders a component in a test environment
 * - screen: Queries to find elements in the rendered component
 * - fireEvent/userEvent: Simulates user interactions
 * - Queries: getByText, getByRole, queryBy, findBy, etc.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "../button";
import { Badge } from "../badge";

/**
 * ============================================================================
 * TEST SUITE 1: Button Component
 * ============================================================================
 *
 * NOTE: Since Button is a shadcn component, these tests demonstrate
 * component testing concepts. When you create your own custom components,
 * you'll use the same patterns!
 */
describe("Button Component", () => {
  /**
   * TEST CASE: Basic rendering
   *
   * WHAT WE'RE TESTING:
   * - The button renders successfully
   * - The text content is displayed correctly
   */
  it("should render button with text", () => {
    // ARRANGE & ACT: Render the component
    render(<Button>Click me</Button>);

    // ASSERT: Check if the button with text exists
    const button = screen.getByText("Click me");
    expect(button).toBeInTheDocument();
  });

  /**
   * TEST CASE: Render as actual button element
   * Testing semantic HTML - important for accessibility
   */
  it("should render as a button element by default", () => {
    render(<Button>Submit</Button>);

    // Query by role is great for accessibility testing
    const button = screen.getByRole("button", { name: "Submit" });
    expect(button).toBeInTheDocument();
  });

  /**
   * TEST CASE: Apply custom className
   * Testing that custom styles can be applied
   */
  it("should apply custom className", () => {
    render(<Button className="custom-class">Styled Button</Button>);

    const button = screen.getByText("Styled Button");
    expect(button).toHaveClass("custom-class");
  });

  /**
   * TEST CASE: Click handler
   * Testing user interactions
   *
   * IMPORTANT CONCEPT: vi.fn() creates a "mock function"
   * - A mock is a fake function that tracks if/how it was called
   * - Perfect for testing event handlers
   */
  it("should call onClick handler when clicked", () => {
    // Create a mock function to track clicks
    const handleClick = vi.fn();

    // Render button with the mock handler
    render(<Button onClick={handleClick}>Click me</Button>);

    // Simulate user clicking the button
    const button = screen.getByText("Click me");
    button.click();

    // Assert that the handler was called exactly once
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  /**
   * TEST CASE: Disabled state
   * Testing that disabled buttons don't trigger clicks
   */
  it("should not call onClick when disabled", () => {
    const handleClick = vi.fn();

    render(
      <Button onClick={handleClick} disabled>
        Disabled
      </Button>
    );

    const button = screen.getByText("Disabled");
    button.click();

    // Handler should NOT be called because button is disabled
    expect(handleClick).not.toHaveBeenCalled();
  });

  /**
   * TEST CASE: Different variants
   * Testing component variants/styles
   */
  it("should apply variant data attribute", () => {
    render(<Button variant="destructive">Delete</Button>);

    const button = screen.getByText("Delete");
    // Check that the data attribute is set correctly
    expect(button).toHaveAttribute("data-variant", "destructive");
  });

  /**
   * TEST CASE: Different sizes
   */
  it("should apply size data attribute", () => {
    render(<Button size="lg">Large Button</Button>);

    const button = screen.getByText("Large Button");
    expect(button).toHaveAttribute("data-size", "lg");
  });
});

/**
 * ============================================================================
 * TEST SUITE 2: Badge Component
 * ============================================================================
 */
describe("Badge Component", () => {
  /**
   * TEST CASE: Basic rendering
   */
  it("should render badge with text", () => {
    render(<Badge>New</Badge>);

    const badge = screen.getByText("New");
    expect(badge).toBeInTheDocument();
  });

  /**
   * TEST CASE: Default variant
   */
  it("should render with default variant", () => {
    render(<Badge>Badge</Badge>);

    const badge = screen.getByText("Badge");
    expect(badge).toBeInTheDocument();
  });

  /**
   * TEST CASE: Neutral variant
   */
  it("should render with neutral variant", () => {
    render(<Badge variant="neutral">Neutral</Badge>);

    const badge = screen.getByText("Neutral");
    expect(badge).toBeInTheDocument();
  });

  /**
   * TEST CASE: Custom className
   */
  it("should apply custom className", () => {
    render(<Badge className="test-class">Custom</Badge>);

    const badge = screen.getByText("Custom");
    expect(badge).toHaveClass("test-class");
  });
});

/**
 * ============================================================================
 * TIPS FOR TESTING YOUR OWN COMPONENTS:
 * ============================================================================
 *
 * 1. TEST USER BEHAVIOR, NOT IMPLEMENTATION:
 *    ❌ Bad: Test if useState was called
 *    ✅ Good: Test if clicking button shows/hides content
 *
 * 2. USE PROPER QUERIES (in order of preference):
 *    - getByRole: Best for accessibility
 *    - getByLabelText: For form inputs
 *    - getByText: For text content
 *    - getByTestId: Last resort
 *
 * 3. QUERY VARIANTS:
 *    - getBy: Throws error if not found (use for elements that MUST exist)
 *    - queryBy: Returns null if not found (use to test absence)
 *    - findBy: Returns promise, waits for element (use for async)
 *
 * 4. COMMON MATCHERS FOR COMPONENTS:
 *    - toBeInTheDocument(): Element exists in DOM
 *    - toHaveClass(): Element has CSS class
 *    - toHaveAttribute(): Element has specific attribute
 *    - toBeDisabled(): Form element is disabled
 *    - toBeVisible(): Element is visible
 *
 * 5. TESTING INTERACTIONS:
 *    ```ts
 *    import { fireEvent } from '@testing-library/react'
 *
 *    const button = screen.getByRole('button')
 *    fireEvent.click(button)
 *    ```
 *
 * 6. TESTING ASYNC BEHAVIOR:
 *    ```ts
 *    const element = await screen.findByText('Loaded')
 *    expect(element).toBeInTheDocument()
 *    ```
 *
 * 7. EXAMPLE: Testing a Custom Product Card
 *    ```ts
 *    describe('ProductCard', () => {
 *      it('should display product name and price', () => {
 *        const product = { name: 'Laptop', price: 5000000 }
 *        render(<ProductCard product={product} />)
 *
 *        expect(screen.getByText('Laptop')).toBeInTheDocument()
 *        expect(screen.getByText('Rp5.000.000')).toBeInTheDocument()
 *      })
 *
 *      it('should call onAddToCart when button clicked', () => {
 *        const onAddToCart = vi.fn()
 *        render(<ProductCard onAddToCart={onAddToCart} />)
 *
 *        const button = screen.getByRole('button', { name: /add to cart/i })
 *        fireEvent.click(button)
 *
 *        expect(onAddToCart).toHaveBeenCalled()
 *      })
 *    })
 *    ```
 *
 * ============================================================================
 */
