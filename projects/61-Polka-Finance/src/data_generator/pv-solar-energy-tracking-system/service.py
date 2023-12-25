#!/usr/bin/env python3
import typing as tp
import robonomicsinterface as RI
import yaml
import hashlib
import random
import logging
import sys
import threading
from substrateinterface import SubstrateInterface, Keypair
from substrateinterface.exceptions import SubstrateRequestException
import ast

from pv_station import PVStation, PVStationNFTMetadata

logger = logging.getLogger(__name__)
logger.propagate = False
handler = logging.StreamHandler(sys.stdout)
formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
handler.setFormatter(formatter)
logger.addHandler(handler)
logger.setLevel(logging.INFO)


class PVService:
    def __init__(self) -> None:
        with open("./config/config_service.yaml") as f:
            self.config = yaml.safe_load(f)
        self.interface = RI.RobonomicsInterface(
            self.config["robonomics"]["seed"], remote_ws="ws://127.0.0.1:9944")
        self.westmint_keypair = Keypair.create_from_mnemonic(
            self.config["westmint"]["seed"], ss58_format=42
        )
        self.substrate_interface = self.westmint_connect()
        self.twin_id = self.config["robonomics"]["twin_id"]
        # threading.Thread(target=self.launch_listener,
        #                  name="LaunchListener").start()

    def on_launch(self, data: tp.Tuple[str, str, bool]) -> None:
        logger.info("Add account to existing Digital Twin")
        plug_address = data[0]
        logger.info(f"Plug station address {plug_address}")
        twins_list = self.get_twins_list()
        if twins_list is None:
            twins_list = []
        topic_num = len(twins_list)
        logger.info(f"Number of existing topics: {topic_num}")
        for topic in twins_list:
            if topic[1] == plug_address:
                logger.info(
                    f"Topic with address {plug_address} already exists")
                break
        else:
            name = hashlib.sha256(bytes(topic_num)).hexdigest()
            params = {"id": self.twin_id, "topic": f"0x{name}",
                      "source": plug_address}
            hash = self.interface.custom_extrinsic(
                "DigitalTwin", "set_source", params)
            logger.info(f"Created topic with extrinsic hash: {hash}")

    # def launch_listener(self) -> None:
    #     RI.Subscriber(
    #         self.interface, RI.SubEvent.NewLaunch, self.on_launch, self.interface.define_address()
    #     )

    def get_twins_list(self) -> tp.List[tp.Tuple[str, str]]:
        twin = self.interface.custom_chainstate(
            "DigitalTwin", "DigitalTwin", self.twin_id)

        if twin is None:
            return None

        twins_list = twin.value
        return twins_list

    def westmint_connect(self) -> SubstrateInterface:
        # For now using Westmint (it is a test network)
        interface = SubstrateInterface(
            url=self.config["westmint"]["endpoint"],
            type_registry_preset="westend"
        )
        return interface

    def transfer_call(self, substrate: SubstrateInterface, power_MWh: int, payment_account_address: str) -> tp.Any:
        call = substrate.compose_call(
            call_module="Assets",
            # To make transfer of new assets to target account it should shave enough native tokens to
            # supply value of our asset
            call_function="transfer",
            call_params={
                "id": self.config["westmint"]["token_id"],
                "target": {"Id": payment_account_address},
                "amount": str(power_MWh),
            },
        )

        return call

    def nft_get_available_item_id(self) -> int:
        while True:
            item_id = random.randint(1, 1000)
            if not self.nft_assets_check_item_exists(item_id):
                return item_id

    def nft_assets_check_item_exists(self, item_id) -> bool:
        val = self.substrate_interface.query(
            module="Uniques",
            storage_function="Asset",
            params=[self.config["westmint"]["collection_id"], item_id]
        ).value

        if val is None:
            return False

        return True

    def nft_mint_call(self, substrate: SubstrateInterface, payment_account_address: str, item_id: int) -> tp.Any:
        call = substrate.compose_call(
            call_module="Uniques",
            call_function="mint",
            call_params={
                "collection": self.config["westmint"]["collection_id"],
                "item": item_id,
                "owner": {"Id": payment_account_address},
            },
        )

        return call

    def nft_add_metadata_to_item(self, substrate: SubstrateInterface, metadata: str, item_id: int) -> tp.Any:
        print(f"metadata = {metadata}")
        call = substrate.compose_call(
            call_module="Uniques",
            call_function="set_metadata",
            call_params={
                "collection": self.config["westmint"]["collection_id"],
                "item": item_id,
                "data": metadata,
                "is_frozen": False
            },
        )

        return call

    def transfer_tokens_for_generated_power(self, power: int, payment_account_address: str) -> bool:
        extrinsic = self.substrate_interface.create_signed_extrinsic(
            call=self.transfer_call(self.substrate_interface, power, payment_account_address), keypair=self.westmint_keypair
        )
        try:
            receipt = self.substrate_interface.submit_extrinsic(
                extrinsic, wait_for_inclusion=True)

            if not receipt.is_success:
                logger.error(
                    f"Transaction failed, block : {receipt.block_hash}")
                return False

            logger.info(
                f"Tokens for {power} MW paid, transaction block : {receipt.block_hash}"
            )
            return True
        except SubstrateRequestException as e:
            logger.warning(
                f"Something went wrong during extrinsic submission to Westmint: {e}"
            )
            return False

    def mint_nft_for_power_producer(self, payment_account_address: str, item_id) -> bool:
        extrinsic = self.substrate_interface.create_signed_extrinsic(
            call=self.nft_mint_call(self.substrate_interface, payment_account_address, item_id), keypair=self.westmint_keypair
        )
        try:
            receipt = self.substrate_interface.submit_extrinsic(
                extrinsic, wait_for_inclusion=True)

            if not receipt.is_success:
                logger.error(
                    f"Transaction failed, block : {receipt.block_hash}")
                return False

            logger.info(
                f"NFT minted (ID {item_id}), transaction block : {receipt.block_hash}"
            )
            return True
        except SubstrateRequestException as e:
            logger.warning(
                f"Something went wrong during extrinsic submission to Westmint: {e}"
            )
            return False

    def add_metdata_to_nft_item(self, metadata: str, item_id: int) -> bool:
        extrinsic = self.substrate_interface.create_signed_extrinsic(
            call=self.nft_add_metadata_to_item(self.substrate_interface, metadata, item_id), keypair=self.westmint_keypair
        )
        try:
            receipt = self.substrate_interface.submit_extrinsic(
                extrinsic, wait_for_inclusion=True)

            if not receipt.is_success:
                logger.error(
                    f"Transaction failed, block : {receipt.block_hash}")
                return False

            logger.info(
                f"Metadata added, transaction block : {receipt.block_hash}"
            )
            return True
        except SubstrateRequestException as e:
            logger.warning(
                f"Something went wrong during extrinsic submission to Statemine: {e}"
            )
            return False

    def create_nft_for_generated_power(self, station: PVStation) -> bool:
        nft_item_id = self.nft_get_available_item_id()

        input("Press any key to mint NFT")

        if not self.mint_nft_for_power_producer(station.payment_account_address, nft_item_id):
            logger.error("Failed to create nft for generated power!")
            return False

        metadata = PVStationNFTMetadata(power_mw=station.power_generated_for_sale,
                                        owner_addr=station.payment_account_address, price=station.power_generated_for_sale,
                                        creation_start_date=str(station.creation_end_date), creation_end_date=str(station.creation_end_date))


        if not self.add_metdata_to_nft_item(str(metadata), nft_item_id):
            logger.error("Failed to add metdata to nft!")
            return False

        return True

    def save_produced_energy(self, station_data: tp.Tuple[int, str]) -> None:
        station = PVStation.from_json(ast.literal_eval(station_data[1]))
        if int(station.power_generated_for_sale) > 0:
            if not self.create_nft_for_generated_power(station):
                return

    def get_last_data(self) -> None:
        # threading.Timer(self.config["service"]
        #                 ["interval"], self.get_last_data).start()
        twins_list = self.get_twins_list()

        if twins_list is None:
            logger.info(f"No existing twins with topics found")
            return

        for station_plug in twins_list:
            station_plug_address = station_plug[1]
            # Fetch datalog from plug PV power station address
            data = self.interface.fetch_datalog(station_plug_address)
            if data is not None:
                # logger.info(
                #     f"Fetched data from pluged PV power station: {data}")
                self.save_produced_energy(data)


if __name__ == "__main__":
    m = PVService()
    #threading.Thread(target=m.get_last_data).start()
    while True:
        m.get_last_data()