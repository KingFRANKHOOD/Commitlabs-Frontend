"use client";
import React, { useState } from "react";

/**
 * MarketplaceFilters Component
 *
 * A comprehensive filters sidebar for the Commitment Marketplace.
 * Allows users to filter commitments by type, price, duration, compliance score, and loss threshold.
 *
 * @param {Object} props
 * @param {Object} props.filters - Current filter state
 * @param {Function} props.onFilterChange - Callback when filters change
 * @param {boolean} props.isOpen - Controls mobile drawer visibility
 * @param {Function} props.onClose - Callback to close mobile drawer
 */
// 1. Define the CommitmentType type
type CommitmentType = "balanced" | "aggressive" | "conservative";

// 2. Array of commitment types
const commitmentTypes: CommitmentType[] = [
  "balanced",
  "aggressive",
  "conservative",
];

// 3. Filters interface
interface Filters {
  sortBy: string;
  commitmentType: CommitmentType;
  priceRange: [number, number];
  durationRange: [number, number];
  minCompliance: number;
  maxLoss: number;
}

// 4. Props interface
interface MarketplaceFiltersProps {
  filters?: Filters;
  onFilterChange?: (filters: Filters) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

// 5. Component
const MarketplaceFilters = ({
  filters = {
    sortBy: "price",
    commitmentType: "balanced",
    priceRange: [0, 1000000],
    durationRange: [0, 90],
    minCompliance: 0,
    maxLoss: 100,
  },
  onFilterChange,
  isOpen = true,
  onClose,
}: MarketplaceFiltersProps) => {
  const [localFilters, setLocalFilters] = useState<Filters>(filters);

  const handleFilterUpdate = <K extends keyof Filters>(
    key: K,
    value: Filters[K],
  ) => {
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);
    onFilterChange?.(updated);
  };

  const handleReset = () => {
    const defaults: Filters = {
      sortBy: "price",
      commitmentType: "balanced",
      priceRange: [0, 1000000],
      durationRange: [0, 90],
      minCompliance: 0,
      maxLoss: 100,
    };
    setLocalFilters(defaults);
    onFilterChange?.(defaults);
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };
  return (
    <>
      <style>{`
       

        

        .filters-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          z-index: 998;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .filters-overlay.active {
          opacity: 1;
        }

        @media (max-width: 768px) {
          .filters-overlay {
            display: block;
          }
        }

        .marketplace-filters {
          width: 320px;
          background: #0A0A0A;
          border: 1px solid gray;
          border-radius: 16px;
          padding: 24px;
          
          font-family: 'Space Mono', monospace;
          color: #e8eef7;
          position: relative;
          overflow-y: auto;
          max-height: calc(100vh - 120px);
        }

        @media (max-width: 768px) {
          .marketplace-filters {
            position: fixed;
            left: 0;
            bottom: 0;
            width: 100%;
            max-height: 85vh;
            border-radius: 24px 24px 0 0;
            transform: translateY(100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 999;
            padding: 32px 24px 24px;
          }

          .marketplace-filters.open {
            transform: translateY(0);
          }

          .marketplace-filters::before {
            content: '';
            position: absolute;
            top: 12px;
            left: 50%;
            transform: translateX(-50%);
            width: 48px;
            height: 4px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 2px;
          }
        }

        .filter-section {
          margin-bottom: 28px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(0, 243, 255, 0.08);
        }

        .filter-section:last-of-type {
          border-bottom: none;
          padding-bottom: 0;
        }

        .filter-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: rgba(0, 243, 255, 0.9);
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-label::before {
          content: '';
          width: 3px;
          height: 12px;
          background: linear-gradient(180deg, #00f3ff 0%, #0088ff 100%);
          border-radius: 2px;
          box-shadow: 0 0 8px rgba(0, 243, 255, 0.5);
        }

        .select-wrapper {
          position: relative;
        }

        .filter-select {
          width: 100%;
          padding: 12px 16px;
          background: rgba(0, 243, 255, 0.03);
          border: 1px solid rgba(0, 243, 255, 0.15);
          border-radius: 8px;
          color: #e8eef7;
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s ease;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%2300f3ff' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 40px;
        }

        .filter-select:hover {
          background: rgba(0, 243, 255, 0.06);
          border-color: rgba(0, 243, 255, 0.3);
          box-shadow: 0 0 16px rgba(0, 243, 255, 0.1);
        }

        .filter-select:focus {
          outline: none;
          border-color: rgba(0, 243, 255, 0.5);
          box-shadow: 0 0 20px rgba(0, 243, 255, 0.15);
        }

        .commitment-types {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .commitment-type-option {
          padding: 12px 16px;
          background: rgba(0, 243, 255, 0.02);
          border: 1px solid rgba(0, 243, 255, 0.1);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
          color: #b8c5d6;
          position: relative;
          overflow: hidden;
        }

        .commitment-type-option::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: linear-gradient(180deg, #00f3ff 0%, #0088ff 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .commitment-type-option:hover {
          background: rgba(0, 243, 255, 0.05);
          border-color: rgba(0, 243, 255, 0.2);
          color: #e8eef7;
        }

        .commitment-type-option.active {
          background: rgba(0, 243, 255, 0.08);
          border-color: rgba(0, 243, 255, 0.4);
          color: #00f3ff;
          font-weight: 700;
          box-shadow: 0 0 16px rgba(0, 243, 255, 0.12);
        }

        .commitment-type-option.active::before {
          opacity: 1;
        }

        .slider-container {
          padding: 8px 4px;
        }

        .slider-wrapper {
          position: relative;
          margin: 20px 0 12px;
        }

        .slider-track {
          height: 4px;
          background: rgba(0, 243, 255, 0.1);
          border-radius: 2px;
          position: relative;
        }

        .slider-range {
          position: absolute;
          height: 100%;
          background: linear-gradient(90deg, #00f3ff 0%, #0088ff 100%);
          border-radius: 2px;
          box-shadow: 0 0 12px rgba(0, 243, 255, 0.4);
        }

        .slider-input {
          position: absolute;
          width: 100%;
          top: -8px;
          height: 20px;
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
          pointer-events: none;
        }

        .slider-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          background: linear-gradient(135deg, #00f3ff 0%, #0088ff 100%);
          border: 2px solid #0a0e17;
          border-radius: 50%;
          cursor: pointer;
          pointer-events: auto;
          box-shadow: 
            0 0 16px rgba(0, 243, 255, 0.6),
            0 2px 8px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
        }

        .slider-input::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 
            0 0 24px rgba(0, 243, 255, 0.8),
            0 4px 12px rgba(0, 0, 0, 0.4);
        }

        .slider-input::-webkit-slider-thumb:active {
          transform: scale(1.1);
        }

        .slider-input::-moz-range-thumb {
          width: 18px;
          height: 18px;
          background: linear-gradient(135deg, #00f3ff 0%, #0088ff 100%);
          border: 2px solid #0a0e17;
          border-radius: 50%;
          cursor: pointer;
          pointer-events: auto;
          box-shadow: 
            0 0 16px rgba(0, 243, 255, 0.6),
            0 2px 8px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
        }

        .slider-input::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 
            0 0 24px rgba(0, 243, 255, 0.8),
            0 4px 12px rgba(0, 0, 0, 0.4);
        }

        .slider-labels {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: rgba(184, 197, 214, 0.7);
          margin-top: 8px;
        }

        .slider-value {
          color: #00f3ff;
          font-weight: 700;
        }

        .reset-button {
          width: 100%;
          padding: 14px;
          background: rgba(0, 243, 255, 0.05);
          border: 1px solid rgba(0, 243, 255, 0.2);
          border-radius: 10px;
          color: #b8c5d6;
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 24px;
        }

        .reset-button:hover {
          background: rgba(0, 243, 255, 0.08);
          border-color: rgba(0, 243, 255, 0.35);
          color: #00f3ff;
          box-shadow: 0 0 20px rgba(0, 243, 255, 0.15);
          transform: translateY(-1px);
        }

        .reset-button:active {
          transform: translateY(0);
        }

        .close-button {
          display: none;
          position: absolute;
          top: 16px;
          right: 16px;
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #b8c5d6;
          font-size: 20px;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #e8eef7;
        }

        @media (max-width: 768px) {
          .close-button {
            display: flex;
          }
        }

        /* Accessibility improvements */
        .slider-input:focus {
          outline: 2px solid rgba(0, 243, 255, 0.5);
          outline-offset: 2px;
        }

        .commitment-type-option:focus {
          outline: 2px solid rgba(0, 243, 255, 0.5);
          outline-offset: 2px;
        }

        /* Scrollbar styling */
        .marketplace-filters::-webkit-scrollbar {
          width: 6px;
        }

        .marketplace-filters::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }

        .marketplace-filters::-webkit-scrollbar-thumb {
          background: rgba(0, 243, 255, 0.3);
          border-radius: 3px;
        }

        .marketplace-filters::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 243, 255, 0.5);
        }

        /* Range input styling for better cross-browser support */
        .slider-input::-moz-range-track {
          background: transparent;
          border: none;
        }

        .slider-input:focus::-webkit-slider-thumb {
          box-shadow: 
            0 0 0 4px rgba(0, 243, 255, 0.2),
            0 0 16px rgba(0, 243, 255, 0.6),
            0 2px 8px rgba(0, 0, 0, 0.3);
        }
      `}</style>

      {/* Mobile overlay */}
      <div
        className={`filters-overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`marketplace-filters ${isOpen ? "open" : ""}`}
        role="complementary"
        aria-label="Marketplace filters"
      >
        <button
          className="close-button"
          onClick={onClose}
          aria-label="Close filters"
        >
          ✕
        </button>

        {/* Sort By */}
        <div className="filter-section">
          <label className="filter-label" htmlFor="sort-by">
            Sort By
          </label>
          <div className="select-wrapper">
            <select
              id="sort-by"
              className="filter-select"
              value={localFilters.sortBy}
              onChange={(e) => handleFilterUpdate("sortBy", e.target.value)}
            >
              <option value="price">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="compliance">Compliance Score</option>
              <option value="duration">Duration Remaining</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Commitment Type */}
        <div className="commitment-types">
          <div className="filter-label">
            Commitment Type
          </div>
          {commitmentTypes.map(
            (
              type: CommitmentType, // <-- cast type here
            ) => (
              <div
                key={type}
                className={`commitment-type-option ${localFilters.commitmentType === type ? "active" : ""}`}
                onClick={() => handleFilterUpdate("commitmentType", type)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleFilterUpdate("commitmentType", type);
                  }
                }}
                role="radio"
                aria-checked={localFilters.commitmentType === type}
                tabIndex={0}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}{" "}
                {/* optional nice formatting */}
              </div>
            ),
          )}
        </div>

        {/* Price Range */}
        <div className="filter-section mt-5">
          <div className="filter-label">Price Range</div>
          <div className="slider-container">
            <div className="slider-wrapper">
              <div className="slider-track">
                <div
                  className="slider-range"
                  style={{
                    left: `${(localFilters.priceRange[0] / 1000000) * 100}%`,
                    width: `${((localFilters.priceRange[1] - localFilters.priceRange[0]) / 1000000) * 100}%`,
                  }}
                />
              </div>
              <input
                type="range"
                min="0"
                max="1000000"
                step="10000"
                value={localFilters.priceRange[0]}
                onChange={(e) =>
                  handleFilterUpdate("priceRange", [
                    Number(e.target.value),
                    localFilters.priceRange[1],
                  ])
                }
                className="slider-input"
                aria-label="Minimum price"
                style={{ zIndex: localFilters.priceRange[0] > 500000 ? 2 : 1 }}
              />
              <input
                type="range"
                min="0"
                max="1000000"
                step="10000"
                value={localFilters.priceRange[1]}
                onChange={(e) =>
                  handleFilterUpdate("priceRange", [
                    localFilters.priceRange[0],
                    Number(e.target.value),
                  ])
                }
                className="slider-input"
                aria-label="Maximum price"
                style={{ zIndex: localFilters.priceRange[1] < 500000 ? 2 : 1 }}
              />
            </div>
            <div className="slider-labels">
              <span className="slider-value">
                {formatCurrency(localFilters.priceRange[0])}
              </span>
              <span className="slider-value">
                {formatCurrency(localFilters.priceRange[1]) +
                  (localFilters.priceRange[1] >= 1000000 ? "+" : "")}
              </span>
            </div>
          </div>
        </div>

        {/* Duration Remaining */}
        <div className="filter-section">
          <div className="filter-label">Duration Remaining</div>
          <div className="slider-container">
            <div className="slider-wrapper">
              <div className="slider-track">
                <div
                  className="slider-range"
                  style={{
                    left: `${(localFilters.durationRange[0] / 90) * 100}%`,
                    width: `${((localFilters.durationRange[1] - localFilters.durationRange[0]) / 90) * 100}%`,
                  }}
                />
              </div>
              <input
                type="range"
                min="0"
                max="90"
                step="1"
                value={localFilters.durationRange[0]}
                onChange={(e) =>
                  handleFilterUpdate("durationRange", [
                    Number(e.target.value),
                    localFilters.durationRange[1],
                  ])
                }
                className="slider-input"
                aria-label="Minimum duration"
                style={{ zIndex: localFilters.durationRange[0] > 45 ? 2 : 1 }}
              />
              <input
                type="range"
                min="0"
                max="90"
                step="1"
                value={localFilters.durationRange[1]}
                onChange={(e) =>
                  handleFilterUpdate("durationRange", [
                    localFilters.durationRange[0],
                    Number(e.target.value),
                  ])
                }
                className="slider-input"
                aria-label="Maximum duration"
                style={{ zIndex: localFilters.durationRange[1] < 45 ? 2 : 1 }}
              />
            </div>
            <div className="slider-labels">
              <span className="slider-value">
                {localFilters.durationRange[0]} days
              </span>
              <span className="slider-value">
                {localFilters.durationRange[1]} days
              </span>
            </div>
          </div>
        </div>

        {/* Min Compliance Score */}
        <div className="filter-section">
          <div className="filter-label">Min Compliance Score</div>
          <div className="slider-container">
            <div className="slider-wrapper">
              <div className="slider-track">
                <div
                  className="slider-range"
                  style={{
                    left: "0%",
                    width: `${localFilters.minCompliance}%`,
                  }}
                />
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={localFilters.minCompliance}
                onChange={(e) =>
                  handleFilterUpdate("minCompliance", Number(e.target.value))
                }
                className="slider-input"
                aria-label="Minimum compliance score"
              />
            </div>
            <div className="slider-labels">
              <span>0%</span>
              <span className="slider-value">
                {localFilters.minCompliance}%
              </span>
            </div>
          </div>
        </div>

        {/* Max Loss Threshold */}
        <div className="filter-section">
          <div className="filter-label">Max Loss Threshold</div>
          <div className="slider-container">
            <div className="slider-wrapper">
              <div className="slider-track">
                <div
                  className="slider-range"
                  style={{
                    left: "0%",
                    width: `${localFilters.maxLoss}%`,
                  }}
                />
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={localFilters.maxLoss}
                onChange={(e) =>
                  handleFilterUpdate("maxLoss", Number(e.target.value))
                }
                className="slider-input"
                aria-label="Maximum loss threshold"
              />
            </div>
            <div className="slider-labels">
              <span>0%</span>
              <span className="slider-value">{localFilters.maxLoss}%</span>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <button className="reset-button" onClick={handleReset}>
          Reset Filters
        </button>
      </aside>
    </>
  );
};

export default MarketplaceFilters;



