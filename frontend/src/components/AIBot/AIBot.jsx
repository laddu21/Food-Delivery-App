import { useState, useContext } from 'react'
import './AIBot.css'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom'
import { food_list, currency, url } from '../../assets/assets'
import axios from 'axios'
import PropTypes from 'prop-types'

const AIBot = ({ setShowAIBot, isLoggedIn, setShowLogin }) => {
    const [userInput, setUserInput] = useState('')
    const [suggestedItems, setSuggestedItems] = useState([])
    const [selectedQuote, setSelectedQuote] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const { addToCart, addAiFood } = useContext(StoreContext)
    const navigate = useNavigate()

    // Food quotes collection
    const foodQuotes = {
        spicy: [
            "\"Spice is the variety of life. Without it, everything would be bland.\" - Unknown",
            "\"The best way to execute French cooking is to get good and loaded and whack the hell out of a chicken.\" - Julia Child",
            "\"Spicy food brings out the sweat on your brow and the water in your eyes, but it also brings out the absolute best in you.\" - Unknown",
            "\"Good food is the foundation of genuine happiness.\" - Auguste Escoffier"
        ],
        healthy: [
            "\"Let food be thy medicine and medicine be thy food.\" - Hippocrates",
            "\"Eating healthy food fills your body with energy and nutrients.\" - Unknown",
            "\"The greatest wealth is health.\" - Virgil",
            "\"Take care of your body. It's the only place you have to live.\" - Jim Rohn"
        ],
        sweet: [
            "\"Life is short, eat dessert first.\" - Jacques Torres",
            "\"All you need is love. But a little chocolate now and then doesn't hurt.\" - Charles Schulz",
            "\"Dessert is like a feel-good song and the best ones make you dance.\" - Edward Lee",
            "\"A balanced diet is a cookie in each hand.\" - Barbara Johnson"
        ],
        pasta: [
            "\"Everything you see I owe to spaghetti.\" - Sophia Loren",
            "\"Pasta is the one food that fosters creativity.\" - Unknown",
            "\"The trouble with eating Italian food is that five or six days later you're hungry again.\" - George Miller",
            "\"Pasta doesn't make you fat. How much pasta you eat makes you fat.\" - Giada De Laurentiis"
        ],
        chicken: [
            "\"The chicken is a dangerous threat. It must be contained.\" - Jarod Kintz",
            "\"Chicken is the best blank canvas for any flavor profile.\" - Unknown",
            "\"One cannot think well, love well, sleep well, if one has not dined well.\" - Virginia Woolf",
            "\"Food is symbolic of love when words are inadequate.\" - Alan D. Wolfelt"
        ],
        salad: [
            "\"A salad is not a meal. It's a style.\" - Fran Lebowitz",
            "\"The wise man should consider that health is the greatest of human blessings.\" - Hippocrates",
            "\"Eating a salad a day keeps the doctor away.\" - Unknown",
            "\"Salad is roughage and a French idea.\" - M.F.K. Fisher"
        ],
        general: [
            "\"One cannot think well, love well, sleep well, if one has not dined well.\" - Virginia Woolf",
            "\"Food is the most primitive form of comfort.\" - Sheila Graham",
            "\"The only way to get rid of a temptation is to yield to it.\" - Oscar Wilde",
            "\"People who love to eat are always the best people.\" - Julia Child"
        ]
    }

    const handleInputChange = (e) => {
        setUserInput(e.target.value)
    }

    const handleSearch = async () => {
        if (!userInput.trim()) return

        setIsSearching(true)
        setSuggestedItems([])
        setSelectedQuote('')

        try {
            const response = await axios.post(`${url}/api/food/ai-search`, { query: userInput })
            if (response.data.success) {
                const aiFoods = response.data.data
                setSuggestedItems(aiFoods)

                // Select a random quote
                const quotes = foodQuotes.general
                const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
                setSelectedQuote(randomQuote)
            } else {
                // Fallback to local search if API fails
                const keywords = userInput.toLowerCase().split(' ')
                let suggestions = []

                // Match based on food name, category, or description
                food_list.forEach(item => {
                    const itemName = item.food_name.toLowerCase()
                    const itemCategory = item.food_category.toLowerCase()
                    const itemDesc = item.food_desc.toLowerCase()

                    const matchesKeyword = keywords.some(keyword =>
                        itemName.includes(keyword) ||
                        itemCategory.includes(keyword) ||
                        itemDesc.includes(keyword)
                    )

                    if (matchesKeyword) {
                        suggestions.push({
                            _id: item._id,
                            name: item.food_name,
                            description: item.food_desc,
                            price: item.food_price,
                            category: item.food_category,
                            image: item.food_image
                        })
                    }
                })

                if (suggestions.length === 0) {
                    suggestions = food_list.slice(0, 6).map(item => ({
                        _id: item._id,
                        name: item.food_name,
                        description: item.food_desc,
                        price: item.food_price,
                        category: item.food_category,
                        image: item.food_image
                    }))
                }

                setSuggestedItems(suggestions.slice(0, 6))
                const quotes = foodQuotes.general
                const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
                setSelectedQuote(randomQuote)
            }
        } catch (error) {
            console.error("AI search failed:", error)
            // Fallback to local search
            const keywords = userInput.toLowerCase().split(' ')
            let suggestions = []

            food_list.forEach(item => {
                const itemName = item.food_name.toLowerCase()
                const itemCategory = item.food_category.toLowerCase()
                const itemDesc = item.food_desc.toLowerCase()

                const matchesKeyword = keywords.some(keyword =>
                    itemName.includes(keyword) ||
                    itemCategory.includes(keyword) ||
                    itemDesc.includes(keyword)
                )

                if (matchesKeyword) {
                    suggestions.push({
                        _id: item._id,
                        name: item.food_name,
                        description: item.food_desc,
                        price: item.food_price,
                        category: item.food_category,
                        image: item.food_image
                    })
                }
            })

            if (suggestions.length === 0) {
                suggestions = food_list.slice(0, 6).map(item => ({
                    _id: item._id,
                    name: item.food_name,
                    description: item.food_desc,
                    price: item.food_price,
                    category: item.food_category,
                    image: item.food_image
                }))
            }

            setSuggestedItems(suggestions.slice(0, 6))
            const quotes = foodQuotes.general
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
            setSelectedQuote(randomQuote)
        }

        setIsSearching(false)
    }

    const handleAddToCart = (item) => {
        if (!isLoggedIn) {
            setShowLogin(true)
            return
        }

        // If it's an AI-generated item, add it to aiFoodList first
        if (item._id.startsWith('ai_')) {
            addAiFood(item)
        }

        addToCart(item._id)
        // Redirect to cart after adding
        setTimeout(() => {
            navigate('/cart')
            setShowAIBot(false)
        }, 500)
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    return (
        <div className="ai-bot-overlay">
            <div className="ai-bot-modal">
                <div className="ai-bot-header">
                    <div className="ai-bot-icon">
                        <span className="miracle-icon">✨</span>
                    </div>
                    <h2>AI Food Assistant</h2>
                    <button className="close-btn" onClick={() => setShowAIBot(false)}>×</button>
                </div>

                <div className="ai-bot-content">
                    <div className="ai-input-section">
                        <p>Tell me what you&apos;re craving or what type of food you want!</p>
                        <div className="ai-input-container">
                            <input
                                type="text"
                                placeholder="e.g., I want something healthy, or pasta, or chicken..."
                                value={userInput}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                            />
                            <button
                                className="search-btn"
                                onClick={handleSearch}
                                disabled={isSearching}
                            >
                                {isSearching ? '🔍' : '🔍'}
                            </button>
                        </div>
                    </div>

                    {isSearching && (
                        <div className="loading-section">
                            <div className="loading-spinner"></div>
                            <p>Finding the perfect food for you...</p>
                        </div>
                    )}

                    {suggestedItems.length > 0 && !isSearching && (
                        <div className="suggestions-section">
                            {selectedQuote && (
                                <div className="food-quote">
                                    <blockquote>{selectedQuote}</blockquote>
                                </div>
                            )}
                            <h3>Recommended for you:</h3>
                            <div className="food-grid">
                                {suggestedItems.map((item) => (
                                    <div key={item._id} className="food-card">
                                        <div className="food-image-container">
                                            <img src={item.image} alt={item.name} />
                                        </div>
                                        <div className="food-info">
                                            <h4>{item.name}</h4>
                                            <p className="food-category">{item.category}</p>
                                            <p className="food-price">{currency}{item.price}</p>
                                            <button
                                                className="add-to-cart-btn"
                                                onClick={() => handleAddToCart(item)}
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

AIBot.propTypes = {
    setShowAIBot: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    setShowLogin: PropTypes.func.isRequired,
}

export default AIBot