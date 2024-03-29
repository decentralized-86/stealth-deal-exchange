const fetchABI = async (contractAddress: string) => {
  try {
    const url = `https://api.polygonscan.com/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=ZK9CDU55VXH824N2912TFQU1YWQQZSBPGC`;

    const response = await fetch(url);
    console.log(response);
    const data = await response.json();

    if (data.status !== "1" || !data.result[0].ABI) {
      throw new Error("ABI not found or error in API response");
    }
    console.log(data);
    return data.result[0].ABI;
  } catch (err) {
    throw err instanceof Error ? err : JSON.stringify(err);
  }
};

export default fetchABI;
