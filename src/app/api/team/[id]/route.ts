export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  const { id } = params;

  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );
  const user = await response.json();

  const { name, email } = user;

  return new Response(
    JSON.stringify({
      name,
      email,
    }),
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
}

export async function DELETE(request: Request) {
  return new Response(
    JSON.stringify({
      message: "User deleted",
    }),
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
}

export async function PUT(
  request: Request,
  { params }: { params: { id: number } }
) {
  const { id } = params;

  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );
  const user = await response.json();

  const { name, email } = user;

  return new Response(
    JSON.stringify({
      name,
      email,
    }),
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
}
