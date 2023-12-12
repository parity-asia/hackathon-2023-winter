//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

using Substrate.NetApi.Attributes;
using Substrate.NetApi.Model.Types.Base;
using Substrate.NetApi.Model.Types.Metadata.V14;
using System.Collections.Generic;


namespace Substrate.Hexalem.NET.NetApiExt.Generated.Model.pallet_hexalem.pallet
{
    
    
    /// <summary>
    /// >> 134 - Composite[pallet_hexalem.pallet.TileCost]
    /// </summary>
    [SubstrateNodeType(TypeDefEnum.Composite)]
    public sealed class TileCost : BaseType
    {
        
        /// <summary>
        /// >> tile_to_buy
        /// </summary>
        private Substrate.Hexalem.NET.NetApiExt.Generated.Model.hexalem_runtime.HexalemTile _tileToBuy;
        
        /// <summary>
        /// >> cost
        /// </summary>
        private Substrate.Hexalem.NET.NetApiExt.Generated.Model.pallet_hexalem.pallet.MaterialCost _cost;
        
        public Substrate.Hexalem.NET.NetApiExt.Generated.Model.hexalem_runtime.HexalemTile TileToBuy
        {
            get
            {
                return this._tileToBuy;
            }
            set
            {
                this._tileToBuy = value;
            }
        }
        
        public Substrate.Hexalem.NET.NetApiExt.Generated.Model.pallet_hexalem.pallet.MaterialCost Cost
        {
            get
            {
                return this._cost;
            }
            set
            {
                this._cost = value;
            }
        }
        
        public override string TypeName()
        {
            return "TileCost";
        }
        
        public override byte[] Encode()
        {
            var result = new List<byte>();
            result.AddRange(TileToBuy.Encode());
            result.AddRange(Cost.Encode());
            return result.ToArray();
        }
        
        public override void Decode(byte[] byteArray, ref int p)
        {
            var start = p;
            TileToBuy = new Substrate.Hexalem.NET.NetApiExt.Generated.Model.hexalem_runtime.HexalemTile();
            TileToBuy.Decode(byteArray, ref p);
            Cost = new Substrate.Hexalem.NET.NetApiExt.Generated.Model.pallet_hexalem.pallet.MaterialCost();
            Cost.Decode(byteArray, ref p);
            var bytesLength = p - start;
            TypeSize = bytesLength;
            Bytes = new byte[bytesLength];
            System.Array.Copy(byteArray, start, Bytes, 0, bytesLength);
        }
    }
}