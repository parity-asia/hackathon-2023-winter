//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Substrate.Hexalem.NET.RestClient.Mockup.Generated.Interfaces
{
   using System;
   using System.Threading.Tasks;
   using Substrate.Hexalem.NET.NetApiExt.Generated.Model.pallet_hexalem.pallet;
   using Substrate.Hexalem.NET.NetApiExt.Generated.Types.Base;
   
   public interface IHexalemModuleControllerMockupClient
   {
      Task<bool> SetGameStorage(Game value, Arr32U8 key);
      Task<bool> SetHexBoardStorage(HexBoard value, Substrate.Hexalem.NET.NetApiExt.Generated.Model.sp_core.crypto.AccountId32 key);
      Task<bool> SetTargetGoalStorage(Arr16U8 value, Substrate.Hexalem.NET.NetApiExt.Generated.Model.sp_core.crypto.AccountId32 key);
   }
}