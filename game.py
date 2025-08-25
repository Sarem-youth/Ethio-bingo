import json
import random

def generate_bingo_card():
    """
    Generates a single, standard 5x5 Bingo card with a free space in the middle.

    The card follows these rules:
    - B: 5 unique numbers from 1-15
    - I: 5 unique numbers from 16-30
    - N: 4 unique numbers from 31-45 (middle is 'FREE')
    - G: 5 unique numbers from 46-60
    - O: 5 unique numbers from 61-75

    Returns:
        list: A 5x5 list representing the Bingo card.
    """
    card = [[0 for _ in range(5)] for _ in range(5)]
    
    # Define the number ranges for each column
    ranges = {
        'B': (1, 15),
        'I': (16, 30),
        'N': (31, 45),
        'G': (46, 60),
        'O': (61, 75)
    }

    # Populate each column with random, unique numbers from its range
    b_col = random.sample(range(ranges['B'][0], ranges['B'][1] + 1), 5)
    i_col = random.sample(range(ranges['I'][0], ranges['I'][1] + 1), 5)
    # For the 'N' column, we only need 4 numbers
    n_col = random.sample(range(ranges['N'][0], ranges['N'][1] + 1), 4)
    g_col = random.sample(range(ranges['G'][0], ranges['G'][1] + 1), 5)
    o_col = random.sample(range(ranges['O'][0], ranges['O'][1] + 1), 5)

    # Assign the generated numbers to the card matrix
    for i in range(5):
        card[i][0] = b_col[i]
        card[i][1] = i_col[i]
        # Handle the 'N' column and the free space
        if i < 2:
            card[i][2] = n_col[i]
        elif i > 2:
            card[i][2] = n_col[i-1]
        card[i][3] = g_col[i]
        card[i][4] = o_col[i]

    # Set the middle of the card to "FREE"
    card[2][2] = "FREE"
    
    return card

def main():
    """
    Main function to generate 250 Bingo cards and save them to a JSON file.
    """
    num_cards = 250
    all_cards = []

    print(f"Generating {num_cards} Bingo cards...")

    for _ in range(num_cards):
        all_cards.append(generate_bingo_card())

    # Structure the data for JSON output
    output_data = {'bingo_cards': all_cards}
    
    # Define the output filename
    filename = 'bingo_cards.json'

    # Write the data to a JSON file
    try:
        with open(filename, 'w') as f:
            json.dump(output_data, f, indent=4)
        print(f"Successfully generated and saved {num_cards} cards to '{filename}'")
    except IOError as e:
        print(f"Error writing to file: {e}")

if __name__ == "__main__":
    main()
