import {
    ActionGetResponse,
    ActionPostRequest,
    createActionHeaders,
  } from "@solana/actions";
  import { ethers } from "ethers";
  
  const headers = createActionHeaders({
    chainId: "mainnet",
    actionVersion: "2.2.1",
  });
  
  export const GET = async (req: Request) => {
    try {
      const requestUrl = new URL(req.url);
      const { toAddress } = getQueryParams(requestUrl);
      
      const baseHref = new URL(
        `/api/actions/transfer?to=${toAddress}`,
        requestUrl.origin
      ).toString();
  
      const payload = {
        isEthereum: true,
        chain: "0x" + BigInt(22040).toString(16), // AirDAO Testnet
        type: "action",
        title: "Send Payment",
        icon: "https://cryptologos.cc/logos/ambrosus-amb-logo.png",
        description: "Send a payment using AirDAO",
        label: "Send",
        links: {
          actions: [
            {
              label: "Send Payment",
              href: `${baseHref}&amount={amount}`,
              parameters: [
                {
                  name: "amount",
                  label: "Amount to send",
                  required: true,
                },
              ],
            },
          ],
        },
      };
  
      return Response.json(payload, { headers });
    } catch (err) {
      console.error(err);
      return new Response("Error processing request", { status: 400, headers });
    }
  };
  
  export const POST = async (req: Request) => {
    try {
      const requestUrl = new URL(req.url);
      const { amount, toAddress } = getQueryParams(requestUrl);
      const body: ActionPostRequest = await req.json();
      
      const fromAddress = body.account;
      const provider = new ethers.JsonRpcProvider(
        "https://network.ambrosus-test.io"
      );
  
      const nonce = await provider.getTransactionCount(fromAddress, "pending");
      const feeData = await provider.getFeeData();
      const gasLimit = await provider.estimateGas({
        to: toAddress,
        value: ethers.parseEther(amount.toString()),
        from: fromAddress,
      });
  
      const transaction = {
        to: toAddress,
        value: ethers.parseEther(amount.toString()),
        gasPrice: feeData.gasPrice,
        gasLimit,
        nonce,
        chainId: (await provider.getNetwork()).chainId,
        data: "0x",
      };
  
      const serializedTx = ethers.Transaction.from(transaction).unsignedSerialized;
  
      return Response.json({
        transaction: serializedTx,
        message: `Sending ${amount} AMB to ${toAddress}`,
      }, { headers });
  
    } catch (err) {
      console.error(err);
      return new Response("Error preparing transaction", { status: 400, headers });
    }
  };
  
  function getQueryParams(requestUrl: URL) {
    const toAddress = requestUrl.searchParams.get("to") || "";
    const amount = parseFloat(requestUrl.searchParams.get("amount") || "0");
  
    if (!toAddress) throw new Error("Missing recipient address");
    if (amount <= 0) throw new Error("Invalid amount");
  
    return { toAddress, amount };
  }
  
  export const OPTIONS = async () => {
    return new Response(null, { headers });
  };