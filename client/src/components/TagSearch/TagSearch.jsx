import React, { useState, useEffect } from "react";
import styles from "./TagSearch.module.css";

const TagSearch = ({ availableTags, selectedTags, onTagSelect }) => {
  const [tagSearch, setTagSearch] = useState("");
  const [filteredTags, setFilteredTags] = useState([]);

  useEffect(() => {
    if (tagSearch.trim() !== "") {
      const searchMatches = availableTags.filter(
        (tag) =>
          tag.toLowerCase().includes(tagSearch.toLowerCase()) &&
          !selectedTags.includes(tag)
      );
      setFilteredTags(searchMatches);
    } else {
      setFilteredTags([]);
    }
  }, [tagSearch, availableTags, selectedTags]);

  const handleTagSearch = (e) => {
    setTagSearch(e.target.value);
  };

  const handleTagSelection = (tag) => {
    onTagSelect(tag);
    setTagSearch(""); // Clearing search after selection for better UX **
  };

  const selectedTagsCount = selectedTags.length;

  return (
    <div className={styles.tagSearchWrapper}>
      {/* always show selected tags on top */}
      {selectedTags.length > 0 && (
        <div className={styles.selectedTagsContainer}>
          <div className={styles.tagsFilter}>
            {selectedTags.map((tag) => (
              <div
                key={tag}
                className={`${styles.tag} ${styles.tagSelected}`}
                onClick={() => onTagSelect(tag)}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.tagSearchContainer}>
        <input
          type="text"
          placeholder="Search tags..."
          value={tagSearch}
          onChange={handleTagSearch}
          className={styles.tagSearchInput}
        />
      </div>

      <div className={styles.selectionInfo}>
        {selectedTagsCount > 0 ? (
          <span>
            {selectedTagsCount} tag{selectedTagsCount !== 1 ? "s" : ""} selected
          </span>
        ) : (
          <span>Search to find tags</span>
        )}
      </div>

      {filteredTags.length > 0 ? (
        <div className={styles.tagsFilter}>
          {filteredTags.map((tag) => (
            <div
              key={tag}
              className={styles.tag}
              onClick={() => handleTagSelection(tag)}
            >
              {tag}
            </div>
          ))}
        </div>
      ) : (
        tagSearch.trim() !== "" && (
          <div className={styles.noTagsFound}>
            No tags found matching "{tagSearch}"
          </div>
        )
      )}
    </div>
  );
};

export default TagSearch;
