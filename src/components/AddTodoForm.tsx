function AddTodoForm() {
  return (
    <form className="add-form" onSubmit={(event) => event.preventDefault()}>
      <label className="visually-hidden" htmlFor="new-todo">
        New task
      </label>
      <input
        id="new-todo"
        name="text"
        className="add-form__input"
        type="text"
        placeholder="What needs doing?"
        autoComplete="off"
      />
      <button type="submit" className="add-form__button">
        Add
      </button>
    </form>
  )
}

export default AddTodoForm
