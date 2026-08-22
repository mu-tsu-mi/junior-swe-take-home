const PAT = "pat_abcdefghijklmnopqrstuvwxyz0123456789";

async function fetchApiData(url) {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${PAT}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Response status: ", response.status);
    }

    return await response.json();
  } catch (error) {
    console.error("This error was returned: ", error);
  }
}

module.exports = { fetchApiData };
