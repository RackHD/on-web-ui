# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.define :server do |ubuntu|
    ubuntu.vm.box = "ubuntu/trusty64"
    ubuntu.vm.box_url = "https://atlas.hashicorp.com/ubuntu/boxes/trusty64/versions/14.04/providers/virtualbox.box"

    ubuntu.vm.network :forwarded_port, guest: 5000, host: 4444
    ubuntu.vm.network :private_network, ip: "192.168.33.10"
    ubuntu.vm.network :public_network
    ubuntu.ssh.forward_agent = true

    ubuntu.vm.provider :virtualbox do |vb|
      vb.name = "on-web-ui"
      vb.gui = true
      vb.memory = "1024"
      vb.cpus = 1
    end

    ubuntu.vm.provision :file, source: "provision.sh", destination: "/tmp/provision.sh"

    vars = "";
    vars += "VAGRANT_PROVISION=1 "
    # vars += "JENKINS_PROVISION=1 "
    vars += "VERBOSE_PROVISION=1 "
    vars += "TEST_ON_WEB_UI=1 "
    vars += "RUN_ON_WEB_UI=1 "
    ubuntu.vm.provision :shell, inline: vars + " /tmp/provision.sh"
  end

  ## COREOS
  config.vm.define :docker do |coreos|
    coreos.vm.box = "yungsang/coreos"
    coreos.vm.box_url = "https://atlas.hashicorp.com/yungsang/boxes/coreos/versions/1.3.8/providers/virtualbox.box"

    coreos.vm.network :forwarded_port, guest: 2375, host: 2375
    coreos.vm.network :private_network, ip: "192.168.33.10"
    coreos.vm.network :public_network
    coreos.ssh.forward_agent = true

    coreos.vm.synced_folder ".", "/on-web-ui", # create: true
      id: "core", type: "nfs", mount_options: ["nolock", "vers=3", "udp"]
    # coreos.vm.synced_folder ".", "/home/core/vagrant", id: "core", type: "nfs", mount_options: ["nolock", "vers=3", "udp"]

    coreos.vm.provider :virtualbox do |vb|
      vb.name = "on-web-ui-coreos"
      vb.gui = true
      vb.memory = "1024"
      vb.cpus = 1
    end

    coreos.vm.provision :docker do |d|
      d.build_image "/on-web-ui"

      # d.pull_images "yungsang/busybox"
      # d.run "simple-echo",
      #   image: "yungsang/busybox",
      #   args: "-p 8080:8080",
      #   cmd: "nc -p 8080 -l -l -e echo hello world!"
    end
  end

  # config.vm.provision :shell, inline: <<-SHELL
  #   sudo apt-get update
  #   sudo apt-get install -y apache2
  # SHELL
end
