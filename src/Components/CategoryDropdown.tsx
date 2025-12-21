import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CategoryDropdown = ({ value, onChange }) => {

  const handleChange = (e) => {
    onChange(e.target.value);   // ← notify parent
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col gap-2 p-6 max-w-xs"
    >
      <label htmlFor="category" className="text-sm font-semibold text-gray-700">
        Choose a category:
      </label>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <select
          id="category"
          value={value}
          onChange={handleChange}
          className="w-full px-4 py-2 border-2 rounded-lg"
        >
          <option value="">Select a category</option>
          <option value="error">Error</option>
          <option value="information">Information</option>
          <option value="warning">Warning</option>
          <option value="debug">Debug</option>
        </select>
      </motion.div>

      {value && (
        <motion.p className="text-xs text-gray-500 italic">
          Filtering by: <b>{value.toUpperCase()}</b>
        </motion.p>
      )}
    </motion.div>
  );
};

export default CategoryDropdown;
