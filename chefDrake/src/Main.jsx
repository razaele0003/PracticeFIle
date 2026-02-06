import React from "react"
import IngredientsList from "./components/IngredientsList"
import ClaudeRecipe from "./components/ClaudeRecipe"
import { getRecipeFromChatGPT } from "./ai"

export default function Main() {
    const [ingredients, setIngredients] = React.useState(
        []
    )
    const [recipe, setRecipe] = React.useState("")
    const [loading, setLoading] = React.useState(false)

    async function getRecipe() {
        setLoading(true)
        try {
            const recipeMarkdown = await getRecipeFromChatGPT(ingredients)
            setRecipe(recipeMarkdown)
        } catch (err) {
            console.error("Error fetching recipe:", err)
            setRecipe("⚠️ Something went wrong fetching the recipe. Check the console for details.")
        } finally {
            setLoading(false)
        }
    }

    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient")
        setIngredients(prevIngredients => [...prevIngredients, newIngredient])
    }

    function clearIngredients() {
        setIngredients([])
        setRecipe("")
    }

    return (
        <main>
            <form action={addIngredient} className="add-ingredient-form">
                <input
                    type="text"
                    placeholder="e.g. oregano"
                    aria-label="Add ingredient"
                    name="ingredient"
                />
                <button>Add ingredient</button>
            </form>

            {ingredients.length > 0 &&
                <IngredientsList
                    ingredients={ingredients}
                    getRecipe={getRecipe}
                    clearIngredients={clearIngredients}
                />
            }

            {loading && <p style={{textAlign: "center", marginTop: "20px"}}>⏳ Generating your recipe...</p>}
            {recipe && <ClaudeRecipe recipe={recipe} />}
        </main>
    )
}
