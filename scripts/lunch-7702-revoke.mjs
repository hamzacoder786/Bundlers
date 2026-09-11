import { JsonRpcProvider, Wallet, ethers } from "ethers";
import { readFile } from "node:fs/promises";

for (const file of [".env", ".env.local"]) { try { for (const line of (await readFile(file,"utf8")).split(/\r?\n/)) { const m=line.trim().match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/); if(m&&process.env[m[1]]==null) process.env[m[1]]=m[2].trim().replace(/^(['"])(.*)\1$/, "$2"); } } catch {} }
const list=(v)=>String(v||"").split(/[,;\n]+/).map(x=>x.trim()).filter(Boolean);
const provider=new JsonRpcProvider(process.env.LUNCH_RPC_URL,{chainId:4663,name:"robinhood"},{staticNetwork:true});
const owner=new Wallet(process.env.LUNCH_LAUNCHER_PRIVATE_KEY,provider);
const wallets=list(process.env.LUNCH_BUYER_PRIVATE_KEYS).map(k=>new Wallet(k.startsWith("0x")?k:`0x${k}`,provider));
if(!wallets.length) throw new Error("Set LUNCH_BUYER_PRIVATE_KEYS.");
const authorizationList=[];
for(const wallet of wallets){authorizationList.push(await wallet.authorize({address:ethers.ZeroAddress,chainId:4663n,nonce:await provider.getTransactionCount(wallet.address,"pending")}));}
const tx=await owner.sendTransaction({to:owner.address,value:0,authorizationList});
console.log(`Revocation submitted: https://robinhoodchain.blockscout.com/tx/${tx.hash}`);
await tx.wait();
console.log("All configured buyer delegations revoked.");
