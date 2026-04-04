#!/bin/bash

# Create new client demo script
# Usage: ./scripts/create-client.sh client-name "Client Display Name" "#primarycolor"

set -e

if [ -z "$1" ]; then
    echo "❌ Error: Client name required"
    echo ""
    echo "Usage: ./scripts/create-client.sh <client-name> [\"Display Name\"] [#color]"
    echo ""
    echo "Examples:"
    echo "  ./scripts/create-client.sh acmecorp"
    echo "  ./scripts/create-client.sh acmecorp \"ACME Corporation\""
    echo "  ./scripts/create-client.sh acmecorp \"ACME Corp\" \"#e74c3c\""
    exit 1
fi

CLIENT_NAME=$1
DISPLAY_NAME=${2:-"$(echo $1 | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1')"}
PRIMARY_COLOR=${3:-"#6366f1"}

CLIENT_DIR="views/tenants/clients/$CLIENT_NAME"

echo "🚀 Creating new client demo..."
echo ""
echo "   Client ID:     $CLIENT_NAME"
echo "   Display Name:  $DISPLAY_NAME"
echo "   Primary Color: $PRIMARY_COLOR"
echo ""

# Check if client already exists
if [ -d "$CLIENT_DIR" ]; then
    echo "❌ Error: Client '$CLIENT_NAME' already exists!"
    echo "   Location: $CLIENT_DIR"
    exit 1
fi

# Create client directory
echo "📁 Creating directory: $CLIENT_DIR"
mkdir -p "$CLIENT_DIR"

# Copy template files from example-client
echo "📄 Copying template files..."
cp views/tenants/clients/example-client/layout.ejs "$CLIENT_DIR/"
cp views/tenants/clients/example-client/home.ejs "$CLIENT_DIR/"
cp views/tenants/clients/example-client/features.ejs "$CLIENT_DIR/"
cp views/tenants/clients/example-client/contact.ejs "$CLIENT_DIR/"

# Replace placeholders in files
echo "✏️  Customizing files..."
sed -i "s/EXAMPLE CLIENT/$DISPLAY_NAME/g" "$CLIENT_DIR"/*.ejs
sed -i "s/Example Client/$DISPLAY_NAME/g" "$CLIENT_DIR"/*.ejs
sed -i "s/example-client/$CLIENT_NAME/g" "$CLIENT_DIR"/*.ejs
sed -i "s/#6366f1/$PRIMARY_COLOR/g" "$CLIENT_DIR"/*.ejs

echo ""
echo "✅ Client demo created successfully!"
echo ""
echo "📝 Next steps:"
echo ""
echo "   1. Customize the content in:"
echo "      - $CLIENT_DIR/layout.ejs"
echo "      - $CLIENT_DIR/home.ejs"
echo "      - $CLIENT_DIR/features.ejs"
echo "      - $CLIENT_DIR/contact.ejs"
echo ""
echo "   2. Add routes to routes/tenant.js:"
echo ""
echo "      router.get('/client/$CLIENT_NAME', (req, res) => {"
echo "        renderClient(res, '$CLIENT_NAME', 'home', '$DISPLAY_NAME | Home');"
echo "      });"
echo ""
echo "      router.get('/client/$CLIENT_NAME/features', (req, res) => {"
echo "        renderClient(res, '$CLIENT_NAME', 'features', 'Features | $DISPLAY_NAME');"
echo "      });"
echo ""
echo "      router.get('/client/$CLIENT_NAME/contact', (req, res) => {"
echo "        renderClient(res, '$CLIENT_NAME', 'contact', 'Contact | $DISPLAY_NAME');"
echo "      });"
echo ""
echo "   3. Access at: http://localhost:3000/client/$CLIENT_NAME"
echo ""
echo "🎉 Happy coding!"
