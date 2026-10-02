import { useState } from "react";

const faqs = [
  {
    question: "How do I create an account?",
    answer:
      "Click Login or Register in the navigation bar and follow the instructions to create your AdSpot account.",
  },
  {
    question: "How do I buy a product?",
    answer:
      "Find the product you want, open its product page, choose the quantity, add it to your cart, and continue to checkout.",
  },
  {
    question: "How can I check my order?",
    answer:
      "Open your Profile and go to Orders to see your current and previous orders.",
  },
  {
    question: "What should I do if my payment fails?",
    answer:
      "Check that your payment information is correct and try again. If the problem continues, contact AdSpot support.",
  },
  {
    question: "How do I get help with my delivery?",
    answer:
      "Open your order and choose the option to get help with the order. You can also contact AdSpot support.",
  },
  {
    question: "How do I contact AdSpot support?",
    answer:
      "Use the Chat with Us button on the website or visit the AdSpot Help Center.",
  },
];

function HelpPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [search, setSearch] = useState("");

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="help-page">
      <section className="help-hero">
        <h1>How can we help?</h1>

        <p>
          Find answers to common questions or chat with AdSpot support.
        </p>

        <input
          type="text"
          placeholder="Search for help..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      <section className="help-content">
        <h2>Frequently Asked Questions</h2>

        <div className="faq-list">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <div className="faq-item" key={index}>
                <button
                  className="faq-question"
                  onClick={() =>
                    setOpenFaq(openFaq === index ? null : index)
                  }
                >
                  <span>{faq.question}</span>
                  <span>{openFaq === index ? "−" : "+"}</span>
                </button>

                {openFaq === index && (
                  <div className="faq-answer">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No help articles found.</p>
          )}
        </div>

        <div className="still-help">
          <h2>Still need help?</h2>

          <p>
            Our support team is here to help you with your AdSpot
            experience.
          </p>

          <button className="chat-help-button">
            💬 Chat with Us
          </button>
        </div>
      </section>
    </div>
  );
}

export default HelpPage;
