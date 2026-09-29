interface CategoryTagProps {
  category: string
  className?: string
}

function CategoryTag({ category, className = '' }: CategoryTagProps) {
  return (
    <span className={`category-tag ${className}`.trim()} title={`Category: ${category}`}>
      {category}
    </span>
  )
}

export default CategoryTag
