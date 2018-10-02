// This file is based on the repository github.com/Roasbeef/btcd-in-a-box created by Roasbeef
package main

import (
	"bytes"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"text/template"

	"github.com/btcsuite/btcutil"
)

var (
	numRandBytes = flag.Int("num_rand_bytes", 32, "Number of random bytes to read for both the username and password")
)

const (
	autoRpcTemplate = "[Application Options]\nrpcuser={{.Username}}\nrpcpass={{.Password}}"
)

type basicRpcOptions struct {
	Username string
	Password string
}

func main() {
	fmt.Println("Creating rpc config for btcd")
	t := template.Must(template.New("rpcOptions").Parse(autoRpcTemplate))

	randRpcOptions := basicRpcOptions{
		Username: "user",
		Password: "user",
	}

	var autoAuth bytes.Buffer
	if err := t.Execute(&autoAuth, randRpcOptions); err != nil {
		log.Fatalf("unable to generate random auth: %v")
	}

	btcdHomeDir := btcutil.AppDataDir("btcd", false)
	btcctlHomeDir := btcutil.AppDataDir("btcctl", false)
	btcdConfigPath := fmt.Sprintf("%s/btcd.conf", btcdHomeDir)
	btcctlConfigPath := fmt.Sprintf("%s/btcctl.conf", btcctlHomeDir)

	if err := ioutil.WriteFile(btcdConfigPath, autoAuth.Bytes(), 0644); err != nil {
		log.Fatalf("unable to write config for btcd: %v", err)
	}

	if err := ioutil.WriteFile(btcctlConfigPath, autoAuth.Bytes(), 0644); err != nil {
		log.Fatalf("unable to write config for btcctl: %v", err)
	}
	fmt.Println("fin.")
}
