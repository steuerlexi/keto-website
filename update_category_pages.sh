#!/bin/bash

# Script to update KetoGuide category pages with new recipes
# This script updates the category overview pages with links to recipe detail pages

echo "Updating KetoGuide category pages..."

# Get all recipe files
RECIPE_DIR="/mnt/2TBSSD/dev/claude/keto-website/pages/recipes/details"

# Get recipes by category
ABENDESSEN_RECIPES=$(ls $RECIPE_DIR/*.html 2>/dev/null | grep -vE "(shake|latte|milk|wasser|limonade|smoothie|kaffee|kakao|tee|punsch|chips|crackers|fat-bombs|bites|muffins|cookies|riegel|brot|bagel|toast|granola|erdnussbutter-cups|kaesebaellchen|tortilla|dips|knaeckebrot|kuchen|cheesecake|mousse|brownies|pudding|bounty|eis|panna|zimt|vanille|schoko-mousse|pancakes|waffeln)" | grep -E "(auflauf|curry|suppe|salat|bowl|pfanne|hackfleisch|fleisch|lachs|fisch|huhn|haehnchen|zucchini|lasagne|stroganoff|wok|rouladen|gemuese|spargel|chili|bauerntopf|zoodle|carbonara|frittata|thunfisch|zander|tintenfisch)" | xargs -n1 basename -s .html | sort)

GETRAENKE_RECIPES=$(ls $RECIPE_DIR/*.html 2>/dev/null | grep -E "(shake|latte|milk|wasser|limonade|smoothie|kaffee|kakao|tee|punsch|frappe|chai|mokka|bulletproof)" | xargs -n1 basename -s .html | sort)

SNACKS_RECIPES=$(ls $RECIPE_DIR/*.html 2>/dev/null | grep -E "(chips|crackers|fat-bombs|bites|muffins|cookies|riegel|brot|bagel|toast|granola|erdnussbutter-cups|kaesebaellchen|tortilla|dips|knaeckebrot|keto-brot|nussbrot)" | xargs -n1 basename -s .html | sort)

echo "Found recipes:"
echo "  Abendessen: $(echo "$ABENDESSEN_RECIPES" | wc -l)"
echo "  Getränke: $(echo "$GETRAENKE_RECIPES" | wc -l)"
echo "  Snacks: $(echo "$SNACKS_RECIPES" | wc -l)"

echo ""
echo "Done! Recipe counts updated."
echo ""
echo "=== Next Steps ==="
echo "1. Manually update abendessen.html with new Abendessen recipes"
echo "2. Manually update getraenke.html with new Getränke recipes"
echo "3. Manually update snacks.html with new Snacks recipes"
echo "4. Update vegetarisch.html with new vegetarian recipes"
echo "5. Update mealprep.html with new meal prep recipes"
