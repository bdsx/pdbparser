import {MinecraftPacketIds,LoginPacket,PlayStatusPacket,ServerToClientHandshakePacket,ClientToServerHandshakePacket,DisconnectPacket,ResourcePacksInfoPacket,ResourcePackStackPacket,ResourcePackClientResponsePacket,TextPacket,SetTimePacket,StartGamePacket,AddPlayerPacket,AddActorPacket,RemoveActorPacket,AddItemActorPacket,TakeItemActorPacket,MoveActorAbsolutePacket,MovePlayerPacket,RiderJumpPacket,UpdateBlockPacket,AddPaintingPacket,TickSyncPacket,LevelSoundEventPacketV1,LevelEventPacket,BlockEventPacket,ActorEventPacket,MobEffectPacket,UpdateAttributesPacket,InventoryTransactionPacket,MobEquipmentPacket,MobArmorEquipmentPacket,InteractPacket,BlockPickRequestPacket,ActorPickRequestPacket,PlayerActionPacket,HurtArmorPacket,SetActorDataPacket,SetActorMotionPacket,SetActorLinkPacket,SetHealthPacket,SetSpawnPositionPacket,AnimatePacket,RespawnPacket,ContainerOpenPacket,ContainerClosePacket,PlayerHotbarPacket,InventoryContentPacket,InventorySlotPacket,ContainerSetDataPacket,CraftingDataPacket,CraftingEventPacket,GuiDataPickItemPacket,AdventureSettingsPacket,BlockActorDataPacket,PlayerInputPacket,LevelChunkPacket,SetCommandsEnabledPacket,SetDifficultyPacket,ChangeDimensionPacket,SetPlayerGameTypePacket,PlayerListPacket,SimpleEventPacket,EventPacket,SpawnExperienceOrbPacket,ClientboundMapItemDataPacket,MapInfoRequestPacket,RequestChunkRadiusPacket,ChunkRadiusUpdatedPacket,ItemFrameDropItemPacket,GameRulesChangedPacket,CameraPacket,BossEventPacket,ShowCreditsPacket,AvailableCommandsPacket,CommandRequestPacket,CommandBlockUpdatePacket,CommandOutputPacket,UpdateTradePacket,UpdateEquipPacket,ResourcePackDataInfoPacket,ResourcePackChunkDataPacket,ResourcePackChunkRequestPacket,TransferPacket,PlaySoundPacket,StopSoundPacket,SetTitlePacket,AddBehaviorTreePacket,StructureBlockUpdatePacket,ShowStoreOfferPacket,PurchaseReceiptPacket,PlayerSkinPacket,SubClientLoginPacket,AutomationClientConnectPacket,SetLastHurtByPacket,BookEditPacket,NpcRequestPacket,PhotoTransferPacket,ModalFormRequestPacket,ModalFormResponsePacket,ServerSettingsRequestPacket,ServerSettingsResponsePacket,ShowProfilePacket,SetDefaultGameTypePacket,RemoveObjectivePacket,SetDisplayObjectivePacket,SetScorePacket,LabTablePacket,UpdateBlockSyncedPacket,MoveActorDeltaPacket,SetScoreboardIdentityPacket,SetLocalPlayerAsInitializedPacket,UpdateSoftEnumPacket,NetworkStackLatencyPacket,ScriptCustomEventPacket,SpawnParticleEffectPacket,AvailableActorIdentifiersPacket,LevelSoundEventPacketV2,NetworkChunkPublisherUpdatePacket,BiomeDefinitionListPacket,LevelSoundEventPacket,LevelEventGenericPacket,LecternUpdatePacket,AddEntityPacket,RemoveEntityPacket,ClientCacheStatusPacket,OnScreenTextureAnimationPacket,MapCreateLockedCopyPacket,StructureTemplateDataRequestPacket,StructureTemplateDataResponsePacket,ClientCacheBlobStatusPacket,ClientCacheMissResponsePacket,EducationSettingsPacket,EmotePacket,MultiplayerSettingsPacket,SettingsCommandPacket,AnvilDamagePacket,CompletedUsingItemPacket,NetworkSettingsPacket,PlayerAuthInputPacket,CreativeContentPacket,PlayerEnchantOptionsPacket,ItemStackRequestPacket,ItemStackResponsePacket,PlayerArmorDamagePacket,CodeBuilderPacket,UpdatePlayerGameTypePacket,EmoteListPacket,PositionTrackingDBServerBroadcastPacket,PositionTrackingDBClientRequestPacket,DebugInfoPacket,PacketViolationWarningPacket,MotionPredictionHintsPacket,AnimateEntityPacket,CameraShakePacket,PlayerFogPacket,CorrectPlayerMovePredictionPacket,ItemComponentPacket,FilterTextPacket,ClientboundDebugRendererPacket,SyncActorPropertyPacket,AddVolumeEntityPacket,RemoveVolumeEntityPacket,SimulationTypePacket,NpcDialoguePacket}from"./minecraft";
export const packetMap:{
        [MinecraftPacketIds.Login]:typeof LoginPacket;
        [MinecraftPacketIds.PlayStatus]:typeof PlayStatusPacket;
        [MinecraftPacketIds.ServerToClientHandshake]:typeof ServerToClientHandshakePacket;
        [MinecraftPacketIds.ClientToServerHandshake]:typeof ClientToServerHandshakePacket;
        [MinecraftPacketIds.Disconnect]:typeof DisconnectPacket;
        [MinecraftPacketIds.ResourcePacksInfo]:typeof ResourcePacksInfoPacket;
        [MinecraftPacketIds.ResourcePackStack]:typeof ResourcePackStackPacket;
        [MinecraftPacketIds.ResourcePackClientResponse]:typeof ResourcePackClientResponsePacket;
        [MinecraftPacketIds.Text]:typeof TextPacket;
        [MinecraftPacketIds.SetTime]:typeof SetTimePacket;
        [MinecraftPacketIds.StartGame]:typeof StartGamePacket;
        [MinecraftPacketIds.AddPlayer]:typeof AddPlayerPacket;
        [MinecraftPacketIds.AddActor]:typeof AddActorPacket;
        [MinecraftPacketIds.RemoveActor]:typeof RemoveActorPacket;
        [MinecraftPacketIds.AddItemActor]:typeof AddItemActorPacket;
        [MinecraftPacketIds.TakeItemActor]:typeof TakeItemActorPacket;
        [MinecraftPacketIds.MoveActorAbsolute]:typeof MoveActorAbsolutePacket;
        [MinecraftPacketIds.MovePlayer]:typeof MovePlayerPacket;
        [MinecraftPacketIds.RiderJump]:typeof RiderJumpPacket;
        [MinecraftPacketIds.UpdateBlock]:typeof UpdateBlockPacket;
        [MinecraftPacketIds.AddPainting]:typeof AddPaintingPacket;
        [MinecraftPacketIds.TickSync]:typeof TickSyncPacket;
        [MinecraftPacketIds.LevelSoundEventV1]:typeof LevelSoundEventPacketV1;
        [MinecraftPacketIds.LevelEvent]:typeof LevelEventPacket;
        [MinecraftPacketIds.BlockEvent]:typeof BlockEventPacket;
        [MinecraftPacketIds.ActorEvent]:typeof ActorEventPacket;
        [MinecraftPacketIds.MobEffect]:typeof MobEffectPacket;
        [MinecraftPacketIds.UpdateAttributes]:typeof UpdateAttributesPacket;
        [MinecraftPacketIds.InventoryTransaction]:typeof InventoryTransactionPacket;
        [MinecraftPacketIds.MobEquipment]:typeof MobEquipmentPacket;
        [MinecraftPacketIds.MobArmorEquipment]:typeof MobArmorEquipmentPacket;
        [MinecraftPacketIds.Interact]:typeof InteractPacket;
        [MinecraftPacketIds.BlockPickRequest]:typeof BlockPickRequestPacket;
        [MinecraftPacketIds.ActorPickRequest]:typeof ActorPickRequestPacket;
        [MinecraftPacketIds.PlayerAction]:typeof PlayerActionPacket;
        [MinecraftPacketIds.HurtArmor]:typeof HurtArmorPacket;
        [MinecraftPacketIds.SetActorData]:typeof SetActorDataPacket;
        [MinecraftPacketIds.SetActorMotion]:typeof SetActorMotionPacket;
        [MinecraftPacketIds.SetActorLink]:typeof SetActorLinkPacket;
        [MinecraftPacketIds.SetHealth]:typeof SetHealthPacket;
        [MinecraftPacketIds.SetSpawnPosition]:typeof SetSpawnPositionPacket;
        [MinecraftPacketIds.Animate]:typeof AnimatePacket;
        [MinecraftPacketIds.Respawn]:typeof RespawnPacket;
        [MinecraftPacketIds.ContainerOpen]:typeof ContainerOpenPacket;
        [MinecraftPacketIds.ContainerClose]:typeof ContainerClosePacket;
        [MinecraftPacketIds.PlayerHotbar]:typeof PlayerHotbarPacket;
        [MinecraftPacketIds.InventoryContent]:typeof InventoryContentPacket;
        [MinecraftPacketIds.InventorySlot]:typeof InventorySlotPacket;
        [MinecraftPacketIds.ContainerSetData]:typeof ContainerSetDataPacket;
        [MinecraftPacketIds.CraftingData]:typeof CraftingDataPacket;
        [MinecraftPacketIds.CraftingEvent]:typeof CraftingEventPacket;
        [MinecraftPacketIds.GuiDataPickItem]:typeof GuiDataPickItemPacket;
        [MinecraftPacketIds.AdventureSettings]:typeof AdventureSettingsPacket;
        [MinecraftPacketIds.BlockActorData]:typeof BlockActorDataPacket;
        [MinecraftPacketIds.PlayerInput]:typeof PlayerInputPacket;
        [MinecraftPacketIds.LevelChunk]:typeof LevelChunkPacket;
        [MinecraftPacketIds.SetCommandsEnabled]:typeof SetCommandsEnabledPacket;
        [MinecraftPacketIds.SetDifficulty]:typeof SetDifficultyPacket;
        [MinecraftPacketIds.ChangeDimension]:typeof ChangeDimensionPacket;
        [MinecraftPacketIds.SetPlayerGameType]:typeof SetPlayerGameTypePacket;
        [MinecraftPacketIds.PlayerList]:typeof PlayerListPacket;
        [MinecraftPacketIds.SimpleEvent]:typeof SimpleEventPacket;
        [MinecraftPacketIds.Event]:typeof EventPacket;
        [MinecraftPacketIds.SpawnExperienceOrb]:typeof SpawnExperienceOrbPacket;
        [MinecraftPacketIds.ClientboundMapItemData]:typeof ClientboundMapItemDataPacket;
        [MinecraftPacketIds.MapInfoRequest]:typeof MapInfoRequestPacket;
        [MinecraftPacketIds.RequestChunkRadius]:typeof RequestChunkRadiusPacket;
        [MinecraftPacketIds.ChunkRadiusUpdated]:typeof ChunkRadiusUpdatedPacket;
        [MinecraftPacketIds.ItemFrameDropItem]:typeof ItemFrameDropItemPacket;
        [MinecraftPacketIds.GameRulesChanged]:typeof GameRulesChangedPacket;
        [MinecraftPacketIds.Camera]:typeof CameraPacket;
        [MinecraftPacketIds.BossEvent]:typeof BossEventPacket;
        [MinecraftPacketIds.ShowCredits]:typeof ShowCreditsPacket;
        [MinecraftPacketIds.AvailableCommands]:typeof AvailableCommandsPacket;
        [MinecraftPacketIds.CommandRequest]:typeof CommandRequestPacket;
        [MinecraftPacketIds.CommandBlockUpdate]:typeof CommandBlockUpdatePacket;
        [MinecraftPacketIds.CommandOutput]:typeof CommandOutputPacket;
        [MinecraftPacketIds.UpdateTrade]:typeof UpdateTradePacket;
        [MinecraftPacketIds.UpdateEquip]:typeof UpdateEquipPacket;
        [MinecraftPacketIds.ResourcePackDataInfo]:typeof ResourcePackDataInfoPacket;
        [MinecraftPacketIds.ResourcePackChunkData]:typeof ResourcePackChunkDataPacket;
        [MinecraftPacketIds.ResourcePackChunkRequest]:typeof ResourcePackChunkRequestPacket;
        [MinecraftPacketIds.Transfer]:typeof TransferPacket;
        [MinecraftPacketIds.PlaySound]:typeof PlaySoundPacket;
        [MinecraftPacketIds.StopSound]:typeof StopSoundPacket;
        [MinecraftPacketIds.SetTitle]:typeof SetTitlePacket;
        [MinecraftPacketIds.AddBehaviorTree]:typeof AddBehaviorTreePacket;
        [MinecraftPacketIds.StructureBlockUpdate]:typeof StructureBlockUpdatePacket;
        [MinecraftPacketIds.ShowStoreOffer]:typeof ShowStoreOfferPacket;
        [MinecraftPacketIds.PurchaseReceipt]:typeof PurchaseReceiptPacket;
        [MinecraftPacketIds.PlayerSkin]:typeof PlayerSkinPacket;
        [MinecraftPacketIds.SubClientLogin]:typeof SubClientLoginPacket;
        [MinecraftPacketIds.AutomationClientConnect]:typeof AutomationClientConnectPacket;
        [MinecraftPacketIds.SetLastHurtBy]:typeof SetLastHurtByPacket;
        [MinecraftPacketIds.BookEdit]:typeof BookEditPacket;
        [MinecraftPacketIds.NpcRequest]:typeof NpcRequestPacket;
        [MinecraftPacketIds.PhotoTransfer]:typeof PhotoTransferPacket;
        [MinecraftPacketIds.ModalFormRequest]:typeof ModalFormRequestPacket;
        [MinecraftPacketIds.ModalFormResponse]:typeof ModalFormResponsePacket;
        [MinecraftPacketIds.ServerSettingsRequest]:typeof ServerSettingsRequestPacket;
        [MinecraftPacketIds.ServerSettingsResponse]:typeof ServerSettingsResponsePacket;
        [MinecraftPacketIds.ShowProfile]:typeof ShowProfilePacket;
        [MinecraftPacketIds.SetDefaultGameType]:typeof SetDefaultGameTypePacket;
        [MinecraftPacketIds.RemoveObjective]:typeof RemoveObjectivePacket;
        [MinecraftPacketIds.SetDisplayObjective]:typeof SetDisplayObjectivePacket;
        [MinecraftPacketIds.SetScore]:typeof SetScorePacket;
        [MinecraftPacketIds.LabTable]:typeof LabTablePacket;
        [MinecraftPacketIds.UpdateBlockSynced]:typeof UpdateBlockSyncedPacket;
        [MinecraftPacketIds.MoveActorDelta]:typeof MoveActorDeltaPacket;
        [MinecraftPacketIds.SetScoreboardIdentity]:typeof SetScoreboardIdentityPacket;
        [MinecraftPacketIds.SetLocalPlayerAsInitialized]:typeof SetLocalPlayerAsInitializedPacket;
        [MinecraftPacketIds.UpdateSoftEnum]:typeof UpdateSoftEnumPacket;
        [MinecraftPacketIds.NetworkStackLatency]:typeof NetworkStackLatencyPacket;
        [MinecraftPacketIds.ScriptCustomEvent]:typeof ScriptCustomEventPacket;
        [MinecraftPacketIds.SpawnParticleEffect]:typeof SpawnParticleEffectPacket;
        [MinecraftPacketIds.AvailableActorIdentifiers]:typeof AvailableActorIdentifiersPacket;
        [MinecraftPacketIds.LevelSoundEventV2]:typeof LevelSoundEventPacketV2;
        [MinecraftPacketIds.NetworkChunkPublisherUpdate]:typeof NetworkChunkPublisherUpdatePacket;
        [MinecraftPacketIds.BiomeDefinitionList]:typeof BiomeDefinitionListPacket;
        [MinecraftPacketIds.LevelSoundEvent]:typeof LevelSoundEventPacket;
        [MinecraftPacketIds.LevelEventGeneric]:typeof LevelEventGenericPacket;
        [MinecraftPacketIds.LecternUpdate]:typeof LecternUpdatePacket;
        [MinecraftPacketIds.AddEntity]:typeof AddEntityPacket;
        [MinecraftPacketIds.RemoveEntity]:typeof RemoveEntityPacket;
        [MinecraftPacketIds.ClientCacheStatus]:typeof ClientCacheStatusPacket;
        [MinecraftPacketIds.OnScreenTextureAnimation]:typeof OnScreenTextureAnimationPacket;
        [MinecraftPacketIds.MapCreateLockedCopy]:typeof MapCreateLockedCopyPacket;
        [MinecraftPacketIds.StructureTemplateDataRequest]:typeof StructureTemplateDataRequestPacket;
        [MinecraftPacketIds.StructureTemplateDataResponse]:typeof StructureTemplateDataResponsePacket;
        [MinecraftPacketIds.ClientCacheBlobStatus]:typeof ClientCacheBlobStatusPacket;
        [MinecraftPacketIds.ClientCacheMissResponse]:typeof ClientCacheMissResponsePacket;
        [MinecraftPacketIds.EducationSettings]:typeof EducationSettingsPacket;
        [MinecraftPacketIds.Emote]:typeof EmotePacket;
        [MinecraftPacketIds.MultiplayerSettings]:typeof MultiplayerSettingsPacket;
        [MinecraftPacketIds.SettingsCommand]:typeof SettingsCommandPacket;
        [MinecraftPacketIds.AnvilDamage]:typeof AnvilDamagePacket;
        [MinecraftPacketIds.CompletedUsingItem]:typeof CompletedUsingItemPacket;
        [MinecraftPacketIds.NetworkSettings]:typeof NetworkSettingsPacket;
        [MinecraftPacketIds.PlayerAuthInput]:typeof PlayerAuthInputPacket;
        [MinecraftPacketIds.CreativeContent]:typeof CreativeContentPacket;
        [MinecraftPacketIds.PlayerEnchantOptions]:typeof PlayerEnchantOptionsPacket;
        [MinecraftPacketIds.ItemStackRequest]:typeof ItemStackRequestPacket;
        [MinecraftPacketIds.ItemStackResponse]:typeof ItemStackResponsePacket;
        [MinecraftPacketIds.PlayerArmorDamage]:typeof PlayerArmorDamagePacket;
        [MinecraftPacketIds.CodeBuilder]:typeof CodeBuilderPacket;
        [MinecraftPacketIds.UpdatePlayerGameType]:typeof UpdatePlayerGameTypePacket;
        [MinecraftPacketIds.EmoteList]:typeof EmoteListPacket;
        [MinecraftPacketIds.PositionTrackingDBServerBroadcast]:typeof PositionTrackingDBServerBroadcastPacket;
        [MinecraftPacketIds.PositionTrackingDBClientRequest]:typeof PositionTrackingDBClientRequestPacket;
        [MinecraftPacketIds.DebugInfo]:typeof DebugInfoPacket;
        [MinecraftPacketIds.PacketViolationWarning]:typeof PacketViolationWarningPacket;
        [MinecraftPacketIds.MotionPredictionHints]:typeof MotionPredictionHintsPacket;
        [MinecraftPacketIds.AnimateEntity]:typeof AnimateEntityPacket;
        [MinecraftPacketIds.CameraShake]:typeof CameraShakePacket;
        [MinecraftPacketIds.PlayerFog]:typeof PlayerFogPacket;
        [MinecraftPacketIds.CorrectPlayerMovePrediction]:typeof CorrectPlayerMovePredictionPacket;
        [MinecraftPacketIds.ItemComponent]:typeof ItemComponentPacket;
        [MinecraftPacketIds.FilterText]:typeof FilterTextPacket;
        [MinecraftPacketIds.ClientboundDebugRenderer]:typeof ClientboundDebugRendererPacket;
        [MinecraftPacketIds.SyncActorProperty]:typeof SyncActorPropertyPacket;
        [MinecraftPacketIds.AddVolumeEntity]:typeof AddVolumeEntityPacket;
        [MinecraftPacketIds.RemoveVolumeEntity]:typeof RemoveVolumeEntityPacket;
        [MinecraftPacketIds.SimulationType]:typeof SimulationTypePacket;
        [MinecraftPacketIds.NpcDialogue]:typeof NpcDialoguePacket;
    };