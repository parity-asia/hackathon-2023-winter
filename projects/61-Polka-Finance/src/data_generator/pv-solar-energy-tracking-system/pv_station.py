import os
import time
import json
import yaml


class PVStation:
    def __init__(self, company_registry_number="", power_station_id="", creation_start_date=0, creation_end_date=0, power_reserved=0, power_generated_for_sale=0, payment_account_address="") -> None:
        self.company_registry_number = company_registry_number
        self.power_station_id = power_station_id
        self.creation_start_date = creation_start_date
        self.creation_end_date = creation_end_date
        self.power_reserved = power_reserved
        self.power_generated_for_sale = power_generated_for_sale
        self.payment_account_address = payment_account_address

    def __iter__(self):
        yield from {
            "company_registry_number": self.company_registry_number,
            "power_station_id": self.power_station_id,
            "creation_start_date": self.creation_start_date,
            "creation_end_date": self.creation_end_date,
            "power_reserved": self.power_reserved,
            "power_generated_for_sale": self.power_generated_for_sale,
            "payment_account_address": self.payment_account_address
        }.items()

    def __str__(self):
        return json.dumps(dict(self), ensure_ascii=False)

    def __repr__(self):
        return self.__str__()

    def to_json(self):
        return self.__str__()

    def get_station_unique_id(self) -> str:
        return f"{self.company_registry_number}_{self.power_station_id}"

    @staticmethod
    def from_json(json_dct):
        return PVStation(json_dct["company_registry_number"],
                         json_dct["power_station_id"],
                         json_dct["creation_start_date"],
                         json_dct["creation_end_date"],
                         json_dct["power_reserved"],
                         json_dct["power_generated_for_sale"],
                         json_dct["payment_account_address"])

    @staticmethod
    def from_yaml(file_path):
        with open(file_path) as f:
            yaml_config = yaml.safe_load(f)

        return PVStation(yaml_config["company_registry_number"],
                         yaml_config["power_station_id"],
                         0 if "creation_start_date" not in yaml_config else yaml_config[
                             "creation_start_date"],
                         0 if "creation_end_date" not in yaml_config else yaml_config[
                             "creation_end_date"],
                         0 if "power_reserved" not in yaml_config else yaml_config["power_reserved"],
                         0 if "power_generated_for_sale" not in yaml_config else yaml_config[
                             "power_generated_for_sale"],
                         yaml_config["payment_account_address"])

    def load_produced_power_data(self) -> float:
        station_data_file_path = f"./data/{self.company_registry_number}/{self.power_station_id}"
        if os.path.exists(station_data_file_path):
            with open(station_data_file_path) as f:
                try:
                    produced_total = float(
                        f.readline().split(": ")[1])  # in MW
                except:
                    produced_total = 0
        else:
            produced_total = 0

        self.power_reserved = produced_total

        return self.power_reserved

    def update_produced_power_data(self, new_produced_power=0):
        data_folder_path = f"./data/{self.company_registry_number}"
        if not os.path.isdir(data_folder_path):
            os.makedirs(data_folder_path, exist_ok=True)
        else:
            if self.power_reserved == 0:
                self.load_produced_power_data()

        self.power_reserved += new_produced_power

        with open(f"{data_folder_path}/{self.power_station_id}", "w") as f:
            f.write(f"{time.time()}: {self.power_reserved}")


class PVStationNFTMetadata:
    def __init__(self, power_mw=0, owner_addr="", price=0, creation_start_date="", creation_end_date="") -> None:
        self.power_mw = power_mw
        self.owner_addr = owner_addr
        self.price = price
        self.creation_start_date = creation_start_date
        self.creation_end_date = creation_end_date

    def __iter__(self):
        yield from {
            "p": self.power_mw, # power_mw
            "o": self.owner_addr, # owner_addr
            "t": self.price, # price
            "s": self.creation_start_date, # creation_start_date
            "e": self.creation_end_date # creation_end_date
        }.items()

    def __str__(self):
        return json.dumps(dict(self), ensure_ascii=False)

    def __repr__(self):
        return self.__str__()

    def to_json(self):
        return self.__str__()
