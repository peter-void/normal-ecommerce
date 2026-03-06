/**
 * ============================================================================
 * UTILITY FUNCTIONS TESTS - LEARNING EXAMPLES
 * ============================================================================
 *
 * This file demonstrates unit testing for utility functions.
 * Each test is heavily commented to help you understand what's happening.
 *
 * KEY CONCEPTS:
 * - describe(): Groups related tests together
 * - it() or test(): Defines a single test case
 * - expect(): Creates an assertion about what should be true
 * - Matchers: .toBe(), .toEqual(), .toBeUndefined(), etc.
 */

import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  cleanSlug,
  parseNumberInput,
  canTransition,
  generateDate,
  generateYear,
  cn,
} from "../utils";
import { OrderStatus } from "@/generated/prisma/enums";

/**
 * ============================================================================
 * TEST SUITE 1: formatCurrency()
 * ============================================================================
 * Testing currency formatting for Indonesian Rupiah
 */
describe("formatCurrency", () => {
  /**
   * TEST CASE: Should format positive numbers correctly
   *
   * WHAT WE'RE TESTING:
   * - The function converts numbers to Indonesian Rupiah format
   * - It should show "Rp" prefix
   * - It should use dots as thousand separators
   * - It should have no decimal places
   */
  it("should format Indonesian Rupiah correctly", () => {
    // ARRANGE: Set up the test data
    const amount = 150000;

    // ACT: Call the function we're testing
    const result = formatCurrency(amount);

    // ASSERT: Check if the result contains Rp and the number
    expect(result).toContain("Rp");
    expect(result).toContain("150");
  });

  /**
   * TEST CASE: Should handle zero
   */
  it("should format zero correctly", () => {
    const result = formatCurrency(0);
    expect(result).toContain("Rp");
    expect(result).toContain("0");
  });

  /**
   * TEST CASE: Should handle large numbers
   */
  it("should format large numbers with proper thousand separators", () => {
    const amount = 1500000; // 1.5 million
    const result = formatCurrency(amount);
    expect(result).toContain("Rp");
    expect(result).toContain("1");
    expect(result).toContain("500");
  });

  /**
   * TEST CASE: Should handle small numbers
   */
  it("should format small amounts correctly", () => {
    const result = formatCurrency(999);
    expect(result).toContain("Rp");
    expect(result).toContain("999");
  });

  /**
   * TEST CASE: Should round decimal numbers
   * Since we set maximumFractionDigits: 0, it should round to whole number
   */
  it("should round decimal numbers to whole numbers", () => {
    const result1 = formatCurrency(150.75);
    const result2 = formatCurrency(150.25);

    expect(result1).toContain("Rp");
    expect(result1).toContain("151");
    expect(result2).toContain("Rp");
    expect(result2).toContain("150");
  });
});

/**
 * ============================================================================
 * TEST SUITE 2: cleanSlug()
 * ============================================================================
 * Testing slug generation for URLs
 */
describe("cleanSlug", () => {
  /**
   * TEST CASE: Convert to lowercase
   */
  it("should convert text to lowercase", () => {
    const input = "HELLO WORLD";
    const result = cleanSlug(input);

    expect(result).toBe("hello-world");
  });

  /**
   * TEST CASE: Replace spaces with hyphens
   */
  it("should replace spaces with hyphens", () => {
    expect(cleanSlug("my awesome product")).toBe("my-awesome-product");
  });

  /**
   * TEST CASE: Remove special characters
   * NOTE: slugify converts some characters (like $ to 'dollar')
   */
  it("should remove special characters", () => {
    // Most special characters are removed/converted by slugify
    expect(cleanSlug("Product Name!")).toBe("product-name");
    expect(cleanSlug("Hello@World")).toBe("helloworld");
  });

  /**
   * TEST CASE: Handle multiple consecutive spaces
   */
  it("should handle multiple spaces gracefully", () => {
    expect(cleanSlug("hello    world")).toBe("hello-world");
  });

  /**
   * TEST CASE: Trim leading/trailing spaces
   */
  it("should trim leading and trailing spaces", () => {
    expect(cleanSlug("  hello world  ")).toBe("hello-world");
  });

  /**
   * TEST CASE: Already clean slug should remain unchanged
   */
  it("should not modify already clean slugs", () => {
    expect(cleanSlug("already-clean-slug")).toBe("already-clean-slug");
  });
});

/**
 * ============================================================================
 * TEST SUITE 3: parseNumberInput()
 * ============================================================================
 * Testing number parsing with different input formats
 */
describe("parseNumberInput", () => {
  /**
   * TEST CASE: Parse valid integer
   */
  it("should parse valid integer strings", () => {
    expect(parseNumberInput("42")).toBe(42);
    expect(parseNumberInput("100")).toBe(100);
  });

  /**
   * TEST CASE: Parse valid decimal with dot
   */
  it("should parse decimal numbers with dots", () => {
    expect(parseNumberInput("3.14")).toBe(3.14);
    expect(parseNumberInput("99.99")).toBe(99.99);
  });

  /**
   * TEST CASE: Convert comma to dot (European format)
   * In some countries, comma is used as decimal separator
   */
  it("should convert comma to dot for decimal separator", () => {
    expect(parseNumberInput("3,14")).toBe(3.14);
    expect(parseNumberInput("99,99")).toBe(99.99);
  });

  /**
   * TEST CASE: Return undefined for empty strings
   */
  it("should return undefined for empty strings", () => {
    expect(parseNumberInput("")).toBeUndefined();
    expect(parseNumberInput("   ")).toBeUndefined(); // Only whitespace
  });

  /**
   * TEST CASE: Return undefined for invalid input
   */
  it("should return undefined for non-numeric strings", () => {
    expect(parseNumberInput("abc")).toBeUndefined();
    expect(parseNumberInput("12abc")).toBeUndefined();
  });

  /**
   * TEST CASE: Handle whitespace trimming
   */
  it("should trim whitespace before parsing", () => {
    expect(parseNumberInput("  42  ")).toBe(42);
    expect(parseNumberInput("  3.14  ")).toBe(3.14);
  });

  /**
   * TEST CASE: Handle negative numbers
   */
  it("should parse negative numbers", () => {
    expect(parseNumberInput("-42")).toBe(-42);
    expect(parseNumberInput("-3.14")).toBe(-3.14);
  });
});

/**
 * ============================================================================
 * TEST SUITE 4: canTransition()
 * ============================================================================
 * Testing order status transitions
 * BUSINESS LOGIC: Only certain status transitions are allowed
 */
describe("canTransition", () => {
  /**
   * TEST CASE: Valid transition - PAID to SHIPPED
   * When an order is paid, it can be marked as shipped
   */
  it("should allow transition from PAID to SHIPPED", () => {
    const canChange = canTransition(OrderStatus.PAID, OrderStatus.SHIPPED);
    expect(canChange).toBe(true);
  });

  /**
   * TEST CASE: Valid transition - SHIPPED to DELIVERED
   * When an order is shipped, it can be marked as delivered
   */
  it("should allow transition from SHIPPED to DELIVERED", () => {
    const canChange = canTransition(OrderStatus.SHIPPED, OrderStatus.DELIVERED);
    expect(canChange).toBe(true);
  });

  /**
   * TEST CASE: Invalid transition - PENDING to SHIPPED
   * An order must be PAID before it can be SHIPPED
   */
  it("should not allow transition from PENDING to SHIPPED", () => {
    const canChange = canTransition(OrderStatus.PENDING, OrderStatus.SHIPPED);
    expect(canChange).toBe(false);
  });

  /**
   * TEST CASE: Invalid transition - PAID to DELIVERED
   * Cannot skip the SHIPPED status
   */
  it("should not allow skipping SHIPPED status", () => {
    const canChange = canTransition(OrderStatus.PAID, OrderStatus.DELIVERED);
    expect(canChange).toBe(false);
  });

  /**
   * TEST CASE: Terminal states cannot transition
   * Once CANCELLED, DELIVERED, or EXPIRED, no further changes allowed
   */
  it("should not allow transitions from CANCELLED", () => {
    expect(canTransition(OrderStatus.CANCELLED, OrderStatus.PAID)).toBe(false);
  });

  it("should not allow transitions from DELIVERED", () => {
    expect(canTransition(OrderStatus.DELIVERED, OrderStatus.SHIPPED)).toBe(
      false
    );
  });

  it("should not allow transitions from EXPIRED", () => {
    expect(canTransition(OrderStatus.EXPIRED, OrderStatus.PAID)).toBe(false);
  });
});

/**
 * ============================================================================
 * TEST SUITE 5: generateDate()
 * ============================================================================
 * Testing date generation (1-31)
 */
describe("generateDate", () => {
  /**
   * TEST CASE: Should generate array of dates 1-31
   */
  it("should generate array of dates from 1 to 31", () => {
    const dates = generateDate();

    // Check the array length
    expect(dates).toHaveLength(31);

    // Check first and last elements
    expect(dates[0]).toBe("1");
    expect(dates[30]).toBe("31");
  });

  /**
   * TEST CASE: All values should be strings
   */
  it("should return dates as strings", () => {
    const dates = generateDate();
    dates.forEach((date) => {
      expect(typeof date).toBe("string");
    });
  });
});

/**
 * ============================================================================
 * TEST SUITE 6: generateYear()
 * ============================================================================
 * Testing year generation (1945-2011)
 */
describe("generateYear", () => {
  /**
   * TEST CASE: Should generate years from 1945 to 2011
   */
  it("should generate array of years from 1945 to 2011", () => {
    const years = generateYear();

    // Calculate expected length: 2011 - 1945 + 1 = 67 years
    expect(years).toHaveLength(67);

    // Check first and last years
    expect(years[0]).toBe("1945");
    expect(years[years.length - 1]).toBe("2011");
  });

  /**
   * TEST CASE: All values should be strings
   */
  it("should return years as strings", () => {
    const years = generateYear();
    years.forEach((year) => {
      expect(typeof year).toBe("string");
    });
  });
});

/**
 * ============================================================================
 * TEST SUITE 7: cn() - Class Name Utility
 * ============================================================================
 * Testing the Tailwind CSS class merging utility
 */
describe("cn - className utility", () => {
  /**
   * TEST CASE: Should merge multiple class names
   */
  it("should merge multiple class names", () => {
    const result = cn("text-red-500", "bg-blue-500");
    expect(result).toContain("text-red-500");
    expect(result).toContain("bg-blue-500");
  });

  /**
   * TEST CASE: Should handle conditional classes
   */
  it("should handle falsy values gracefully", () => {
    const result = cn("text-red-500", false && "hidden", null, undefined);
    expect(result).toBe("text-red-500");
  });

  /**
   * TEST CASE: Should override conflicting Tailwind classes
   * The cn() function should favor the last class when there's a conflict
   */
  it("should resolve Tailwind class conflicts", () => {
    // When there are conflicting classes, the last one wins
    const result = cn("px-2", "px-4");
    expect(result).toBe("px-4"); // px-4 should override px-2
  });
});

/**
 * ============================================================================
 * TIPS FOR WRITING YOUR OWN TESTS:
 * ============================================================================
 *
 * 1. ARRANGE-ACT-ASSERT Pattern:
 *    - Arrange: Set up test data
 *    - Act: Execute the function
 *    - Assert: Check the result
 *
 * 2. Test One Thing at a Time:
 *    - Each test should verify one specific behavior
 *
 * 3. Use Descriptive Test Names:
 *    - "should do X when Y happens"
 *    - Makes it easy to understand what failed
 *
 * 4. Test Edge Cases:
 *    - Empty strings, null, undefined
 *    - Very large or very small numbers
 *    - Special characters
 *
 * 5. Common Matchers:
 *    - toBe(): For primitive values (numbers, strings, booleans)
 *    - toEqual(): For objects and arrays
 *    - toBeUndefined(): Check if undefined
 *    - toHaveLength(): Check array/string length
 *    - toContain(): Check if array/string contains value
 *
 * 6. Run Tests Frequently:
 *    - Use 'npm run test:watch' during development
 *    - Tests run automatically when you save files
 *
 * ============================================================================
 */
